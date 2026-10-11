#!/usr/bin/env node
/**
 * sv-print 官方文档取数工具。
 *
 * 唯一事实来源是 https://sv-print.ibujian.cn/ 的原始 markdown 文档。
 * 本工具负责按需取文档并本地缓存（ETag 条件请求），使 skill 随文档更新而更新，
 * 不需要用户手动同步 skill 内容。
 *
 *   node scripts/svdoc.mjs index              列出全部文档页（标题 / 路径）
 *   node scripts/svdoc.mjs get <slug|path>    取某一页的 markdown 原文
 *   node scripts/svdoc.mjs search <关键词>      跨全站文档检索
 *
 * 通用选项：
 *   --refresh   忽略缓存有效期，强制重新校验（仍然走 ETag，未变更时只花一次 304）
 *   --offline   完全不联网，只用本地缓存；没有缓存则报错
 *   --json      以 JSON 输出（仅 index / search）
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.cache');
const META = path.join(CACHE, 'meta.json');

const ORIGIN = 'https://sv-print.ibujian.cn';
const LLM_INDEX = '/llms.txt';
const LLM_FULL = '/llms-full.txt';

/** 缓存有效期：默认 6 小时。到期后先发条件请求，内容没变就只回一个 304。 */
const DEFAULT_TTL_MS = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 60_000;

/* ------------------------------------------------------------------ 参数 */

function parseArgs(argv) {
  const opts = { refresh: false, offline: false, json: false, limit: 40 };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--refresh') opts.refresh = true;
    else if (a === '--offline') opts.offline = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--limit') opts.limit = Number(argv[++i]) || opts.limit;
    else if (a === '-h' || a === '--help') opts.help = true;
    else rest.push(a);
  }
  return { opts, rest };
}

const HELP = `svdoc — 取 sv-print 官方文档

  svdoc.mjs index                  列出全部文档页
  svdoc.mjs get <slug|路径|标题>    取某一页 markdown 原文
  svdoc.mjs search <关键词>        跨全站文档检索
  svdoc.mjs sync                  重新生成 references/docs-index.md 路由表

  --refresh   立即重新校验缓存（走 ETag，内容未变只回 304）
  --offline   只用本地缓存，不联网
  --json      JSON 输出（index / search）
  --limit N   search 最多返回 N 条（默认 40）

示例：
  svdoc.mjs get /plugin/5358kw22/index.md
  svdoc.mjs get 5358kw22
  svdoc.mjs search "静默打印"
`;

function die(msg, code = 1) {
  console.error(`svdoc: ${msg}`);
  process.exit(code);
}

/* ------------------------------------------------------- 缓存元数据读写 */

function readMeta() {
  try {
    return JSON.parse(fs.readFileSync(META, 'utf8'));
  } catch {
    return {};
  }
}

function writeMeta(meta) {
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(META, JSON.stringify(meta, null, 2));
}

/** 资源路径 -> 缓存文件名，例如 /llms.txt -> llms.txt，/start/xxx/index.md -> start_xxx_index.md */
function cacheFile(resPath) {
  const flat = resPath.replace(/^\//, '').replace(/[/?=&]/g, '_');
  return path.join(CACHE, flat);
}

/* ------------------------------------------------------------- 网络取数 */

/**
 * 依次尝试：curl 直连 -> curl 走环境代理 -> Node fetch。
 * 直连优先是有意为之：不少环境残留着已失效的 HTTP(S)_PROXY 变量，
 * 直接用代理会 connection refused，而目标站点往往本来就能直连。
 */
function curl(args, timeout) {
  return new Promise((resolve) => {
    const child = spawn('curl', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    const out = [];
    const err = [];
    let timer;
    const done = (fn, v) => {
      clearTimeout(timer);
      fn(v);
    };
    child.stdout.on('data', (d) => out.push(d));
    child.stderr.on('data', (d) => err.push(d));
    timer = setTimeout(() => {
      child.kill('SIGKILL');
      done(resolve, { code: 'timeout', body: '', error: 'curl 超时' });
    }, timeout ?? TIMEOUT_MS);
    child.on('error', (e) => done(resolve, { code: 'spawn-failed', body: '', error: e.message }));
    child.on('close', (code) =>
      done(resolve, {
        code: String(code),
        body: Buffer.concat(out).toString('utf8'),
        error: Buffer.concat(err).toString('utf8'),
      })
    );
  });
}

async function rawFetch(resPath, { headers = {} } = {}) {
  const url = ORIGIN + resPath;
  const common = ['-sS', '-L', '--compressed', '-m', String(Math.ceil(TIMEOUT_MS / 1000)), url];
  const headerArgs = Object.entries(headers).flatMap(([k, v]) => ['-H', `${k}: ${v}`]);
  const writeOut = ['-w', '\n%{http_code}', '-o', '-'];

  const attempts = [
    ['--noproxy', '*', ...common],
    [...common],
  ];

  for (const pre of attempts) {
    const r = await curl([...pre, ...headerArgs, ...writeOut]);
    // curl 退出码 0 才是成功；非 0（含 7 连接失败、28 超时）就换下一种策略
    if (r.code !== '0') continue;

    const nl = r.body.lastIndexOf('\n');
    if (nl < 0) continue;
    const status = r.body.slice(nl + 1).trim();
    return { status: Number(status), body: r.body.slice(0, nl) };
  }

  // 环境里没有 curl，或 curl 全部失败 —— 退回 Node 内置 fetch
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
    return { status: res.status, body: res.status === 304 ? '' : await res.text() };
  } catch (e) {
    die(`网络请求失败：${url}\n  ${e.message}\n  可改用 --offline 使用本地缓存，或检查网络/代理设置。`);
  }
  return null;
}

async function head(resPath) {
  const url = ORIGIN + resPath;
  const args = ['-sI', '-L', '-m', '20', '--noproxy', '*', url];
  const r = await curl(args);
  if (r.code !== '0') {
    const r2 = await curl(['-sI', '-L', '-m', '20', url]);
    if (r2.code !== '0') return {};
    return parseHeaders(r2.body);
  }
  return parseHeaders(r.body);
}

function parseHeaders(raw) {
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    out[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  return out;
}

/* ---------------------------------------------------- 带 ETag 的资源缓存 */

async function load(resPath, { refresh = false, offline = false, ttl = DEFAULT_TTL_MS } = {}) {
  const file = cacheFile(resPath);
  const meta = readMeta();
  const rec = meta[resPath];
  const hasCache = fs.existsSync(file);

  if (offline) {
    if (hasCache) return { body: fs.readFileSync(file, 'utf8'), cached: true, path: file };
    die(`离线模式且本地无缓存：${resPath}\n  先联网执行一次：node scripts/svdoc.mjs index`);
  }

  const fresh = hasCache && Date.now() - (rec?.fetchedAt ?? 0) <= ttl;
  if (hasCache && fresh && !refresh) {
    return { body: fs.readFileSync(file, 'utf8'), cached: true, path: file };
  }

  // 有 ETag 就走条件请求：内容没变时服务端只回 304，不重传正文。
  // --refresh 只表示"现在就重新校验"，不代表"忽略缓存全量重下"。
  const headers = rec?.etag ? { 'If-None-Match': rec.etag } : {};

  const res = await rawFetch(resPath, { headers });

  if (res.status === 304 && hasCache) {
    meta[resPath] = { ...rec, fetchedAt: Date.now() };
    writeMeta(meta);
    return { body: fs.readFileSync(file, 'utf8'), cached: true, path: file };
  }

  if (res.status !== 200) {
    if (hasCache) {
      console.error(`svdoc: ${resPath} 取回失败(HTTP ${res.status})，改用本地缓存。`);
      return { body: fs.readFileSync(file, 'utf8'), cached: true, path: file };
    }
    die(
      `取回失败：${resPath} (HTTP ${res.status})\n` +
        `  页面可能已被站点重组，跑一次 svdoc.mjs sync 更新路由表。`
    );
  }

  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(file, res.body);

  // 站点对 .md 返回 octet-stream，只有文本资源才有 ETag，缺失就退化为无条件重下
  let etag = rec?.etag;
  let lastModified = rec?.lastModified;
  if (!etag) {
    const h = await head(resPath);
    etag = h.etag;
    lastModified = h['last-modified'];
  }

  meta[resPath] = { etag, lastModified, fetchedAt: Date.now(), bytes: Buffer.byteLength(res.body) };
  writeMeta(meta);
  return { body: res.body, cached: false, path: file };
}

/* --------------------------------------------------------------- 索引 */

function parseIndex(text) {
  const pages = [];
  let category = '';
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^###\s+(.*)$/);
    if (h) {
      category = h[1].trim();
      continue;
    }
    const m = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)\s*:?\s*(.*)$/);
    if (m) pages.push({ title: m[1].trim(), path: m[2].trim(), desc: m[3].trim(), category });
  }
  return pages;
}

async function getIndex(opts) {
  const { body } = await load(LLM_INDEX, opts);
  return parseIndex(body);
}

/* ------------------------------------------------------- 路由表生成 */

/**
 * 常见任务 -> 文档页。这些路径若在站点上已重组，生成时会被自动剔除，
 * 避免路由表里留下指向死链的指引。
 */
const TASK_HINTS = [
  ['引入设计器（安装、样式、print-lock.css、各框架写法）', ['/start/oodav1ri/index.md']],
  ['看懂 / 手写模板 JSON', ['/start/q69brsd3/index.md']],
  ['按字段填充打印数据', ['/start/a2q5ybhd/index.md']],
  ['模板存取与导入导出', ['/start/viu8ge1b/index.md']],
  ['浏览器打印 / 静默打印 / 导出文件', ['/start/2xufz46z/index.md']],
  ['Designer 组件参数、事件、插槽、主题', ['/start/rk7lnbm3/index.md']],
  ['设计器工具类（designerUtils）', ['/start/ainpov9q/index.md']],
  ['自定义设计器头部菜单', ['/start/51kg8u3x/index.md']],
  ['打印预览组件', ['/start/n9l5jfm0/index.md']],
  ['插件机制与 hook 体系', ['/plugin/3386uxlb/index.md', '/plugin/hmzpptx6/index.md']],
  ['自定义可拖拽元素 / provider', ['/start/vtjefowz/index.md', '/start/betf4xfh/index.md']],
  ['写自己的插件', ['/plugin/9mrojlia/index.md', '/plugin/v1wt87uq/index.md']],
  ['桌面打印客户端（HTTP / Socket.IO / MQTT）', ['/client/index.md', '/client/kf5qw14s/index.md', '/client/m6xo64g6/index.md', '/client/zonyn521/index.md']],
  ['版本变更与新功能', ['/changelog.md']],
];

async function cmdSync(opts) {
  const pages = await getIndex(opts);
  const live = new Set(pages.map((p) => p.path));

  const titleOf = (path) => pages.find((p) => p.path === path)?.title ?? path;
  const dropped = [];

  const lines = [];
  lines.push('# sv-print 文档路由表');
  lines.push('');
  lines.push('> 本文件由 `node scripts/svdoc.mjs sync` 从站点 `llms.txt` 自动生成，**请勿手工编辑**。');
  lines.push(`> 数据源：${ORIGIN}/llms.txt　生成时间：${new Date().toISOString()}`);
  lines.push('');
  lines.push(`站点当前共 **${pages.length}** 个文档页。取原文：\`node scripts/svdoc.mjs get <路径>\``);
  lines.push('');

  lines.push('## 常见任务速查');
  lines.push('');
  for (const [task, paths] of TASK_HINTS) {
    const alive = paths.filter((p) => live.has(p));
    for (const dead of paths.filter((p) => !live.has(p))) dropped.push(dead);
    if (!alive.length) continue;
    lines.push(`- **${task}** → ${alive.map((p) => `\`${p}\`（${titleOf(p)}）`).join('　')}`);
  }
  lines.push('');

  const byCat = new Map();
  for (const p of pages) {
    if (!byCat.has(p.category)) byCat.set(p.category, []);
    byCat.get(p.category).push(p);
  }

  lines.push('## 全量索引');
  lines.push('');
  for (const [cat, list] of byCat) {
    lines.push(`### ${cat}`);
    lines.push('');
    lines.push('| 路径 | 标题 | 说明 |');
    lines.push('| --- | --- | --- |');
    for (const p of list) {
      const desc = p.desc.replace(/\|/g, '\\|');
      lines.push(`| \`${p.path}\` | ${p.title} | ${desc} |`);
    }
    lines.push('');
  }

  const out = path.join(ROOT, 'references', 'docs-index.md');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join('\n'));

  if (dropped.length) {
    console.error(`svdoc: 站点已无以下路径，已从速查表剔除：${[...new Set(dropped)].join(', ')}`);
  }
  console.log(`已写入 ${path.relative(ROOT, out)}（${pages.length} 页，${lines.length} 行）`);
}

/* ------------------------------------------------------------ 命令实现 */

async function cmdIndex(opts) {
  const pages = await getIndex(opts);

  if (opts.json) {
    console.log(JSON.stringify({ origin: ORIGIN, count: pages.length, pages }, null, 2));
    return;
  }

  const byCat = new Map();
  for (const p of pages) {
    if (!byCat.has(p.category)) byCat.set(p.category, []);
    byCat.get(p.category).push(p);
  }

  for (const [cat, list] of byCat) {
    console.log(`\n## ${cat}`);
    for (const p of list) console.log(`${p.path}  ${p.title}`);
  }
  console.log(`\n共 ${pages.length} 页。用法：svdoc.mjs get <路径>`);
}

/** 允许用完整路径、去掉 .md 的路径、或目录 slug（如 5358kw22）来定位页面。 */
function resolveTarget(input, pages) {
  const norm = (s) => s.replace(/^\//, '').replace(/\/index\.md$/, '').replace(/\.md$/, '');

  const direct = pages.find((p) => p.path === input || norm(p.path) === norm(input));
  if (direct) return direct;

  const bySlug = pages.find((p) => norm(p.path).split('/').includes(norm(input)));
  if (bySlug) return bySlug;

  const loose = pages.filter((p) => p.title.includes(input) || p.desc.includes(input));
  if (loose.length === 1) return loose[0];
  if (loose.length > 1) {
    console.error('匹配到多个文档页，请给更精确的路径：');
    for (const p of loose) console.error(`  ${p.path}  ${p.title}`);
    process.exit(1);
  }
  return null;
}

async function cmdGet(input, opts) {
  if (!input) die('缺少参数。例：svdoc.mjs get /plugin/5358kw22/index.md');

  let target = { path: input.startsWith('/') ? input : `/${input}` };

  if (target.path.endsWith('.md')) {
    // 完整文件名，按原样取
  } else {
    // 其余写法（短 slug、目录路径、标题）统一走索引解析。
    // 目录路径必须走这里：/start/oodav1ri 拼成 .md 是 404，站点实际是 /start/oodav1ri/index.md
    const pages = await getIndex(opts);
    const hit = resolveTarget(input, pages);
    if (hit) {
      target = hit;
    } else if (input.includes('/')) {
      // 索引里没有但像个路径：按字面补 .md 再试一次
      target = { path: `${target.path}.md` };
    } else {
      die(
        `索引中没有匹配「${input}」的文档页。\n` +
          `  用 svdoc.mjs search "${input}" 做全文检索，或 svdoc.mjs index 看全部页面。`
      );
    }
  }

  const { body, cached } = await load(target.path, opts);

  const src = new URL(target.path, ORIGIN).href;
  const banner = `<!-- 来源: ${src} | ${cached ? '本地缓存' : '在线取回'} | 原文未改动 -->`;
  console.log(banner);
  console.log(body);
}

async function cmdSearch(keyword, opts) {
  if (!keyword) die('缺少关键词。例：svdoc.mjs search "静默打印"');

  const pages = await getIndex(opts);
  const hits = [];

  const { body: full, cached } = await load(LLM_FULL, opts);
  const lines = full.split(/\r?\n/);
  const kw = keyword.toLowerCase();

  let current = '文档开头';
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^##\s+(.*)$/);
    if (h) current = h[1].trim();
    if (!lines[i].toLowerCase().includes(kw)) continue;
    hits.push({ section: current, line: i + 1, text: lines[i].trim().slice(0, 240) });
    if (hits.length >= opts.limit * 3) break;
  }

  const pathHints = pages.filter((p) => p.title.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw));

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          keyword,
          source: new URL(LLM_FULL, ORIGIN).href,
          cached,
          matchingPages: pathHints,
          textHits: hits.slice(0, opts.limit),
        },
        null,
        2
      )
    );
    return;
  }

  if (pathHints.length) {
    console.log(`\n命中 ${pathHints.length} 个文档页（优先读这些）:`);
    for (const p of pathHints) console.log(`  ${p.path}  ${p.title}`);
  }

  console.log(`\n全文命中 ${hits.length} 处（来源 ${LLM_FULL}${cached ? '，本地缓存' : ''}）:`);
  for (const h of hits.slice(0, opts.limit)) {
    console.log(`  L${h.line} [${h.section}] ${h.text}`);
  }
  if (hits.length >= opts.limit) console.log(`  ...（已截断，用 --limit 调整）`);
}

/* ---------------------------------------------------------------- main */

async function main() {
  const argv = process.argv.slice(2);
  const { opts, rest } = parseArgs(argv);

  if (opts.help || rest.length === 0) {
    console.log(HELP);
    return;
  }

  const [cmd, ...args] = rest;
  if (cmd === 'index') return cmdIndex(opts);
  if (cmd === 'get') return cmdGet(args[0], opts);
  if (cmd === 'search') return cmdSearch(args.join(' ').trim(), opts);
  if (cmd === 'sync') return cmdSync(opts);

  die(`未知命令：${cmd}\n${HELP}`);
}

main().catch((e) => die(e?.stack ?? String(e)));
