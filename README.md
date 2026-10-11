# skill-sv-print

面向 AI 编程助手的 [sv-print](https://sv-print.ibujian.cn/) 打印设计器技能。

## 设计思路

sv-print 的 API 随版本更新频繁，而 AI 很容易凭记忆写出过时的参数名。
所以本 skill **不复制任何 API 细节**，只做两件事：

1. **路由**——告诉 AI 该看哪一页文档；
2. **取原文**——从官方站点实时抓取那页文档，并本地缓存。

AI 写代码前必须先取原文，因此本 skill 会随官方文档更新而更新，
**使用方不需要更新本 skill**。

## 安装

```bash
npx skills add https://github.com/CcSimple/skill-sv-print
```

安装后在 Claude Code、Trae 等助手中以 `/sv-print <你的需求>` 调用。

## 目录结构

```
SKILL.md                    工作流与纪律（不含 API 细节）
references/docs-index.md    文档路由表，由 sync 从站点生成，勿手改
scripts/svdoc.mjs          取文档工具
```

## svdoc 工具

脚本路径为本 skill 目录下的 `scripts/svdoc.mjs`（`<skill目录>` 指包含 `SKILL.md` 的目录）。

```bash
node <skill目录>/scripts/svdoc.mjs index              # 列出全部文档页
node <skill目录>/scripts/svdoc.mjs get <路径|slug>     # 取某一页 markdown 原文
node <skill目录>/scripts/svdoc.mjs search <关键词>     # 跨全站检索
node <skill目录>/scripts/svdoc.mjs sync               # 重新生成 references/docs-index.md
```

`get` 支持完整路径 `/plugin/5358kw22/index.md`、目录 slug `5358kw22`、
或唯一标题 `DesignerUtils工具类`。

| 选项        | 作用                                          |
| ----------- | --------------------------------------------- |
| `--refresh` | 立即重新校验缓存（走 ETag，内容未变只回 304） |
| `--offline` | 完全不联网，只用本地缓存                      |
| `--json`    | JSON 输出（index / search）                   |
| `--limit N` | `search` 返回条数上限                         |

缓存位于 `.cache/`，默认 6 小时后自动重新校验；站点支持 ETag，
内容未变时只消耗一次 304 往返，不重传正文。

## 使用场景

下面是一些真实业务里会用到的问法。直接把这些话丢给助手即可。
每个场景末尾那行是 skill 会替你定位到的文档页。

### 集成设计器

**把发货单设计器接进现有 Vue3 后台**

> 我们有个 Vue3 管理后台，路由是 `/designer?id=123`。要在里面放一个发货单模板设计器，
> 打开时按 id 从接口拿模板 JSON 回显，顶部菜单只留"保存"和"预览"两个按钮，
> 保存时 POST 回后端。设计器外层容器怎么给尺寸？

`/start/oodav1ri`（安装引入）　`/start/rk7lnbm3`（Designer 参数与事件）　`/start/51kg8u3x`（Header 菜单）

**设计器页要按用户角色显示不同的可拖拽元素**

> 设计器左侧的元素列表是后端按角色返回的 JSON，不同角色能拖的字段不一样。
> 想让运营能拖全部字段、财务只能拖金额类字段。

`/start/vtjefowz`（provider 机制）　`/start/av6vpvjb`（后端直返 providerJson 的简易用法，需 sv-print@0.2.20 起）

### 打印输出

**仓库批量出库，要求无弹窗静默打印**

> 仓库的标签机连着打印客户端，页面点了打印之后不能弹系统打印框，
> 要直接指定某台打印机、一次打 3 份、横着打。

`/start/2xufz46z`（print / print2）　`/client/index`（打印客户端）

**业务系统对接打印客户端，走 HTTP 还是 MQTT**

> 我们后端是 Java 服务，想让服务端直接把打印任务推给客户端，
> 需要知道 HTTP 接口有哪些、MQTT 要连哪个端口、鉴权怎么做。

`/client/kf5qw14s`（47 个 REST 接口）　`/client/zonyn521`（MQTT 18521）　`/client/m6xo64g6`（Socket.IO 17521）

### 批量排版

**一批小标签排到 A4 上再打**

> 我们做的是 90×50mm 的商品标签，一张 A4 能排好几个。
> 希望传入一个数组，自动按行列填满整张 A4，行列间距可配。

`/start/q69brsd3`（模板 JSON 与 `panelLayoutOptions`）　`/start/2xufz46z`（批量打印）

### 导出文件

**月度经营报表导出 Excel，一个单据一个 sheet**

> 财务要导出月度报表，一个门店一个 sheet，要保留合并单元格和样式。

`/plugin/do2akt04`（Excel 导出）

**合同导出 PDF 后要能检索和复制文字**

> 合同要归档，对方会全文搜索文字。截图导出的 PDF 文字不能选，
> 需要文字可选中可搜索的那种。

`/plugin/pw0pl1mt`（矢量 PDF）　`/plugin/5358kw22`（截图版 PDF 的取舍）

**导出 Word，要能原生编辑也能按设计位置浮动排版**

> 报价单要给客户直接改，要原生可编辑的 docx，不是图片；
> 另外有些表格希望还原成设计时的位置，不要被 Word 的网格重排。

`/plugin/75us68iv`（Word 导出，editable / positioned 两种模式）

### 元素与数据

**快递面单上的 GS1 条码和二维码**

> 物流面单要打 GS1 条码和二维码，扫码要能直接解析出运单号和批次。

`/plugin/hd2v8ge3`（bwip-js 条码二维码，100+ 码制）

**订单几十行商品明细，要自动跨页**

> 一个订单的商品行数不固定，少则三五行多则上百行，
> 明细区域要按数组自动循环渲染，撑不下时自动分页。

`/plugin/6y39q21t`（box 容器循环渲染）　`/start/q69brsd3`（table 元素自带分页）

**长表格跨页后每页都要有表头**

> 明细是长表格，跨页之后下一页顶上得重复表头和表尾，不然看不懂哪行是什么。

`/plugin/z0j68n6k`（shtml，`tr` 自动补 thead/tfoot）

**客户地址太长把版式撑坏了**

> 收货地址有的几十个字，固定高度的框装不下就溢出了，想让它自动缩小字号。

`/plugin/xxjtsfin`（字号自适应）

**金额、日期这些字段要按规则格式化**

> 金额要显示成"1,234.50"，日期要显示成"2026 年 10 月 11 日"，
> 希望是配置出来的，不要每个模板都写函数。

`/plugin/1v4zj19q`（数据格式化）　`/plugin/csj6erbg`（字段拖拽绑定）

**合同要盖骑缝章**

> 合同是多页的，章图要按实际页数自动切开，每页边上盖一条，拼起来是完整的章。

`/plugin/f0yhey5u`（骑缝章）

**Excel 里做好表格，粘到打印模板里**

> 我们表格是 Excel 做的，复制粘贴到打印模板后希望能变成能自动分页的表格。

`/plugin/1ivu2s38`（Excel 粘贴表格）

### 部署与排障

**内网离线部署，控制台一直报 websocket 错误**

> 内网没有打印客户端，页面控制台一直报 websocket 连接错误，但业务其实不需要打印。

`/start/vb1canub`（`disAutoConnect` 关闭自动连接）

**项目用了 tailwindcss，引入组件样式报警告**

> 引入 `sv-print/dist/style.css` 后 vite 报
> `@layer utilities is used but no matching @tailwind utilities directive`，
> 项目 tailwind 是 3.x。

`/start/vb1canub`（样式冲突处理）

**打印出来的页面没有样式**

> 预览里样式都对，打印出来是乱的，纸面上没有那些边框和背景。

`/start/oodav1ri`（`print-lock.css` 必须部署且 `media="print"`）

### 还没想好怎么问？

先用一句话描述业务，再让助手自己找文档：

```markdown
用 sv-print 把一批小标签填充到 A4 纸上导出 PDF
```

不确定能力边界时，直接让它检索：

```markdown
svdoc.mjs search "静默打印"
```

## 官方文档

https://sv-print.ibujian.cn/

## 问题反馈

- 提交问题：https://github.com/CcSimple/skill-sv-print/issues
- 联系作者：https://sv-print.ibujian.cn/support.html#%E8%81%94%E7%B3%BB%E6%88%91

## License

MIT
