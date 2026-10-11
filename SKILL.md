---
name: sv-print
description: sv-print 可视化打印设计器——web 拖拽设计打印模板，浏览器打印/静默打印/云打印，导出 PDF、图片、Excel、Word，配套 Electron 桌面打印客户端与 28 个官方插件。当任务涉及 sv-print、hiprint、@sv-print/*、打印模板 JSON、打印设计器组件、打印客户端（HTTP/Socket.IO/MQTT）时使用。本 skill 只做文档路由，API 细节一律实时取自官方文档。
---

# sv-print

本文只提供**定位文档的方法**，不复制 API 细节。

sv-print 的 API 随版本变动频繁（组件包、插件、客户端协议都在更新），
**凭记忆写参数名必然出错**。本 skill 的唯一事实来源是：

> https://sv-print.ibujian.cn/　（站点提供完整 llms.txt）

## 铁律

1. **先取原文，再写代码。** 任何 sv-print 相关代码，动笔前必须先 `get` 对应文档。
2. **不凭记忆填参数。** 参数名、默认值、参数含义、方法签名一律以取回的原文为准。
3. **不补全文档没写的东西。** 文档没覆盖的部分，标注"文档未覆盖，以下为建议"，不要写成既定事实。
4. **交付时给出处。** 说明结论依据哪一页文档，让用户能自己核对。
5. **官方文档本身会自相矛盾。** 同一参数在不同插件页/不同章节可能写法不同，
   这时**不要自己挑一个当定论**——把冲突原样报出来（哪几页各怎么说），
   建议用户实测或提 issue 确认。采信单页就下结论，正是本 skill 要消灭的错误。

## 工作流

```
1. 定位页面   → 读 references/docs-index.md（由站点 llms.txt 生成，含全量 67 页）
2. 取原文     → node <skill目录>/scripts/svdoc.mjs get <路径>
3. 按原文写码
4. 交付       → 附上依据的文档 URL
```

`docs-index.md` 里找不到时，先跑一次 `sync` 重新生成（站点可能新增了页面），
或用 `search` 全站检索。

## 命令

脚本在本 skill 目录下的 `scripts/svdoc.mjs`。执行前先定位 skill 根目录
（即包含本 `SKILL.md` 的目录），再拼接脚本路径，不要假设当前工作目录就是它。

```bash
node <skill目录>/scripts/svdoc.mjs index              # 列出全部文档页
node <skill目录>/scripts/svdoc.mjs get <路径|slug>     # 取某一页 markdown 原文
node <skill目录>/scripts/svdoc.mjs search <关键词>     # 跨全站检索
node <skill目录>/scripts/svdoc.mjs sync               # 重新生成 references/docs-index.md
```

`get` 支持三种写法：完整路径 `/plugin/5358kw22/index.md`、目录 slug `5358kw22`、
唯一标题 `DesignerUtils工具类`。

常用选项：

| 选项        | 作用                                                  |
| ----------- | ----------------------------------------------------- |
| `--refresh` | 立即重新校验缓存（走 ETag，内容没变只回 304，不重传） |
| `--offline` | 完全不联网，只用本地缓存；无缓存则报错                |
| `--limit N` | `search` 返回条数上限                                 |

缓存 6 小时后自动重新校验，文档更新会被自动跟进，**用户不需要更新本 skill**。
取回的原文顶部会标注来源 URL 与是否命中缓存，便于核对。

## 已核实的核心事实

以下几条来自官方文档原文，跨版本较稳定，可直接使用：

- **包与框架对应**：Vue3 → `@sv-print/vue3`，Vue2 → `@sv-print/vue`，
  React → `@sv-print/react`，Svelte/原生 JS → `sv-print`；核心库为 `@sv-print/hiprint`。
  （`/start/oodav1ri/index.md`）
- **组件样式**：入口文件引入 `sv-print/dist/style.css`。
- **打印样式（易踩坑）**：必须把
  `node_modules/@sv-print/hiprint/dist/print-lock.css` 复制到站点资源目录
  （Vue 项目放 `public/`），并在 `index.html` 以 `media="print"` 引入，
  文件名必须保持 `print-lock.css`。部署后若该 URL 访问不到，**打印样式整体失效**。
- **容器尺寸**：官方所有示例都把 Designer 包在一个带显式宽高的容器里
  （`<div style="width:100vw;height:100vh">`，注释写作"宽高自定义"）。
  文档没有明说这是否强制，但照此办理最稳妥。
- **单位约定**：面板（`panels`）宽高单位 **mm**；元素（`printElements`）位置与尺寸单位 **pt**。
- **内置元素只有 9 种**：`text`、`image`、`longText`、`table`、`html`、`hline`、`vline`、
  `rect`、`oval`。其余（条码二维码、图表、PDF、表格设计器等）都来自插件，
  引入插件后会自动插入默认 provider。
- **授权**：未传 `authKey` 时页面会有体验版水印。
- **设计器就绪回调**：`@onDesigned` 的 `e.detail` 里拿到 `{ hiprint, designerUtils }`，
  `designerUtils.printTemplate` 是模板对象，`designerUtils.printData` 是打印数据。

以上每条的出处见括号内路径，取原文可复核。

## 常见问题排查

- **打印样式不生效** → 先确认 `print-lock.css` 是否可公网访问、`media="print"` 是否写对。
- **用户说某参数/功能"不存在"** → 不要直接否定，先
  `get /changelog.md` 确认是否已在新版本加入，再看对应文档页。
- **元素类型找不到** → 确认是否需要对应插件（内置只有 9 种）。
- **要导出 PDF/Excel/Word/图片** → 属 api 插件，按 `/plugin/bexth6es/index.md` 选型。
  两个已知约束（见 `/plugin/5358kw22/index.md`）：`plugin-api-pdf` 与 `plugin-api-pdf3`
  都挂载 `toPdf`，**二选一不可同时注册**；`hiprint.register` 是异步的，**必须在创建
  模板对象之前完成注册**。截图方案导出的 PDF 文字不可选中，要文字可选中请用
  `plugin-api-pdf-vector`。
  ⚠️ **`paperWidth` / `paperHeight` 的单位官方文档自相矛盾，务必先向用户确认**：
  `/plugin/5358kw22/index.md`（api-pdf）与 `/plugin/36necaja/index.md`（api-pdf3）
  写"纸张尺寸，**pt**"；而 `/start/2xufz46z/index.md`、`/plugin/pw0pl1mt/index.md`
  （api-pdf-vector）等处写 `paperWidth: 210 // 纸张宽度 **mm**`。
  这是真实存在的文档冲突，不是你读错了——按铁律 5 如实告知，不要替用户选一个。
- **静默打印 / 批量打印 / 云打印** → 属打印客户端能力，文档在 `/client/` 下，
  HTTP 47 个接口、Socket.IO 17521、MQTT 18521 三套协议各自独立成页。
- **拿到的文档 404** → 站点重组过页面，跑 `svdoc.mjs sync` 更新路由表。

## 边界

- 本 skill 只覆盖 sv-print 官方文档覆盖的能力。
- 文档未覆盖的业务细节（服务端存储、鉴权、字段映射规范等）由使用者自行决定，
  不要假装它们是 sv-print 的既定能力。
