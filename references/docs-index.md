# sv-print 文档路由表

> 本文件由 `node scripts/svdoc.mjs sync` 从站点 `llms.txt` 自动生成，**请勿手工编辑**。
> 数据源：https://sv-print.ibujian.cn/llms.txt　生成时间：2026-10-11T11:13:46.099Z

站点当前共 **67** 个文档页。取原文：`node scripts/svdoc.mjs get <路径>`

## 常见任务速查

- **引入设计器（安装、样式、print-lock.css、各框架写法）** → `/start/oodav1ri/index.md`（安装引入）
- **看懂 / 手写模板 JSON** → `/start/q69brsd3/index.md`（模板数据格式）
- **按字段填充打印数据** → `/start/a2q5ybhd/index.md`（模板数据填充）
- **模板存取与导入导出** → `/start/viu8ge1b/index.md`（模板导入导出）
- **浏览器打印 / 静默打印 / 导出文件** → `/start/2xufz46z/index.md`（模板使用）
- **Designer 组件参数、事件、插槽、主题** → `/start/rk7lnbm3/index.md`（Designer 设计器组件）
- **设计器工具类（designerUtils）** → `/start/ainpov9q/index.md`（DesignerUtils 工具类）
- **自定义设计器头部菜单** → `/start/51kg8u3x/index.md`（Header 设计器头部组件）
- **打印预览组件** → `/start/n9l5jfm0/index.md`（Preview 预览组件）
- **插件机制与 hook 体系** → `/plugin/3386uxlb/index.md`（插件介绍）　`/plugin/hmzpptx6/index.md`（插件开发入门）
- **自定义可拖拽元素 / provider** → `/start/vtjefowz/index.md`（拖拽元素介绍）　`/start/betf4xfh/index.md`（拖拽元素基础使用）
- **写自己的插件** → `/plugin/9mrojlia/index.md`（自定义元素插件）　`/plugin/v1wt87uq/index.md`（自定义属性）
- **桌面打印客户端（HTTP / Socket.IO / MQTT）** → `/client/index.md`（打印客户端介绍）　`/client/kf5qw14s/index.md`（HTTP API）　`/client/m6xo64g6/index.md`（Socket.IO 通信）　`/client/zonyn521/index.md`（MQTT 通信）
- **版本变更与新功能** → `/changelog.md`（更新日志）

## 全量索引

### 快速开始

| 路径                       | 标题                   | 说明                                                                                                                                                                     |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/start/oodav1ri/index.md` | 安装引入               | 介绍 sv-print 各框架组件包的安装与引入：npm/pnpm/yarn 安装命令、组件样式与 print-lock.css 打印样式配置，及 Vue2/Vue3/React/Svelte/jQuery 中引入 Designer 组件的步骤。    |
| `/start/q69brsd3/index.md` | 模板数据格式           | 详解 sv-print 打印模板 JSON 数据格式：panels 面板、printElements 元素、页眉页脚、水印、套打等参数含义与 mm/pt 单位约定，理解后即可动态创建与导入导出模板。               |
| `/start/a2q5ybhd/index.md` | 模板数据填充           | 讲解 sv-print 打印模板的数据填充方法：通过字段名 field 与打印数据 key 的映射自动填充内容，介绍 title、testData、hideTitle 关键参数及格式化函数自定义填充的用法。         |
| `/start/viu8ge1b/index.md` | 模板导入导出           | 介绍 sv-print 打印模板的导入导出实现：从服务端获取模板 JSON 回显设计器，通过 onSave 事件或 getJson API 导出模板，并演示模板对象的浏览器打印与批量打印调用。              |
| `/start/2xufz46z/index.md` | 模板使用               | 演示 sv-print 模板对象的打印输出用法：浏览器打印、静默打印（指定打印机、份数、纸张、横纵向），以及通过插件导出 PDF、图片、Excel、Word 文件的完整 API 示例。              |
| `/start/vj9zeu2s/index.md` | 示例代码下载           | 提供 sv-print 各框架示例代码下载：整合 Vue2、Vue3、React、Svelte、jQuery 完整 demo 的示例代码包与 plugin-demo 插件源码，下载即可运行参考，快速上手打印模板设计开发。     |
| `/start/tnku8mo3/index.md` | skill                  | 介绍开源 skill-sv-print AI 技能的安装与使用：通过 npx skills add 安装到 Claude Code、Trae 等编程助手，用自然语言提示词让 AI 自动引入设计器、加载模板并实现打印功能。     |
| `/start/vb1canub/index.md` | 常见问题 Q&A           |                                                                                                                                                                          |
| `/changelog.md`            | 更新日志               |                                                                                                                                                                          |
| `/start/rk7lnbm3/index.md` | Designer 设计器组件    | sv-print Designer 设计器组件完整 API 文档：模板与打印数据参数、纸张列表、插件注册、可拖拽元素 provider 配置、事件回调、主题样式参数与组件插槽，附 Vue3 示例代码。        |
| `/start/ainpov9q/index.md` | DesignerUtils 工具类   | sv-print DesignerUtils 设计器工具类 API 参考：模板新建保存导入导出、printTemplate 与打印数据操作、代码编辑弹窗、提示/表单/自定义弹窗、预览调用，并支持插件机制扩展 API。 |
| `/start/51kg8u3x/index.md` | Header 设计器头部组件  | sv-print Header 设计器头部组件文档：自定义 logo、标题、拖拽元素列表与菜单项，通过三个插槽完全替换头部区域，定制打印设计器顶部工具栏。                                    |
| `/start/n9l5jfm0/index.md` | Preview 预览组件       | sv-print Preview 打印预览组件文档：业务中打印前预览，支持浏览器打印、静默打印、导出 PDF 与图片按钮配置、打印机列表与默认选中，以及基于 getHtml 的完全自定义预览。        |
| `/start/7nagl3hy/index.md` | DragBox 拖拽盒子组件   | sv-print DragBox 拖拽盒子组件文档：构建设计器内可自由拖动、贴边吸附、记忆位置的面板，支持自定义图标标题与内容插槽，并可通过插件机制为设计器动态添加拖拽框。              |
| `/start/vtjefowz/index.md` | 拖拽元素介绍           | 介绍 sv-print 拖拽元素的 provider 机制：provider 决定拖入设计器元素的默认大小、参数与样式，讲解内置元素类型、自定义 provider 编写及元素类型的导入导出 API。              |
| `/start/betf4xfh/index.md` | 拖拽元素基础使用       | 讲解 sv-print 拖拽元素的基础用法：通过 providers 与 providerMap 将元素渲染到设计器左侧，或用 providerJson、providerRender 与插槽自定义元素 UI 及渲染位置。               |
| `/start/ulpjw2hg/index.md` | 拖拽元素动态函数式使用 | 讲解 sv-print 动态拖拽元素的函数式实现：后端 API 返回元素 JSON Schema，前端通过 provider 工厂函数转换注册，实现按业务模块、用户角色动态生成可拖拽打印元素。              |
| `/start/av6vpvjb/index.md` | 拖拽元素动态简易使用   | 介绍 sv-print 0.2.20 起动态拖拽元素的简易用法：后端直接返回 providerJson 配置，前端 addProviderJson 加载即可生成可拖拽打印元素，无需编写 provider 函数。                 |

### 插件中心

| 路径                        | 标题                                | 说明                                                                                                                                                                         |
| --------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/plugin/3386uxlb/index.md` | 插件介绍                            | 基于 hook 的 sv-print 插件机制介绍，涵盖 api、元素、功能、view 四类插件列表与 init、beforePrint 等全部 hook 说明，用于扩展 web 打印设计器的元素与参数。                      |
| `/plugin/7wrvkocn/index.md` | 插件使用                            | sv-print 插件安装与使用教程，在 Vue3 设计器组件中传入 plugins 参数，或通过 hiprint.register 在业务代码中注册插件，实现条码二维码等打印元素扩展与浏览器打印。                 |
| `/plugin/bexth6es/index.md` | api 插件                            | sv-print api 插件分类介绍，通过 newPrintTemplate hook 为打印模板挂载 toPdf、toImage、toExcel、toWord 等导出方法，实现模板导出 PDF、长图、Excel 与 Word 文件。                |
| `/plugin/ccb1jfi8/index.md` | 元素插件                            | sv-print 元素插件介绍，通过 init 与 createPrintElement hook 新增打印元素，支持 bwip-js 条码二维码、ECharts 图表、HTML 自动分页与骑缝章，拖入打印模板即可使用。               |
| `/plugin/fdb93osu/index.md` | 功能插件                            | sv-print 功能插件分类介绍，不新增打印元素，通过 getOptionItem、onDesigned 等 hook 实现数据格式化、界面多语言、字号自适应、属性控件改写与新手引导，增强打印设计器体验。       |
| `/plugin/sa604pm1/index.md` | view 插件                           | sv-print view 插件分类介绍，通过 onDesigned hook 往打印设计器挂载 UI，包括 CodeMirror 代码编辑器弹窗、可拖拽数据源面板、元素悬浮工具条与 AI 设计模板面板。                   |
| `/plugin/hmzpptx6/index.md` | 插件开发入门                        | sv-print 插件开发入门教程，使用 create-sv-print-plugin 脚手架创建插件工程，编写 init、getOptionItem 等多个 hook 并通过 hiprint.register 注册，扩展 web 打印设计器功能。      |
| `/plugin/v1wt87uq/index.md` | 自定义属性                          | sv-print 自定义属性插件开发教程，通过 init hook 的 Config.registerItems 给元素属性面板新增参数项，属性值随模板 JSON 保存，实现打印元素自定义业务属性扩展。                   |
| `/plugin/kqfbsber/index.md` | 自定义编辑器插件                    | sv-print 自定义编辑器插件开发教程，当项目使用其他版本 CodeMirror 时，通过 onDesigned hook 实现并挂载自定义代码编辑器弹窗，替换打印设计器默认的 CodeMirror 6 编辑器。         |
| `/plugin/udxkz6j6/index.md` | 自定义 api 插件                     | sv-print 自定义 api 插件开发教程，通过 newPrintTemplate hook 为打印模板实例挂载自定义方法，实现导出 PDF 与图片、加密导出模板 JSON、MQTT 发送打印数据等功能扩展。             |
| `/plugin/9mrojlia/index.md` | 自定义元素插件                      | sv-print 自定义元素插件开发教程，通过 init 与 createPrintElement hook 继承 BasePrintElement 实现新打印元素，注册参数面板并挂到设计器元素分组，支持条码二维码与图表元素扩展。 |
| `/plugin/5358kw22/index.md` | PDF 导出 plugin-api-pdf             | sv-print plugin-api-pdf 插件为打印模板挂载 toPdf 方法，基于 jsPDF 将打印页面导出为 PDF 文件，支持 blob/bloburl/dataurl 输出、页级进度回调、自定义纸张尺寸与截图清晰度。      |
| `/plugin/36necaja/index.md` | PDF3 导出 plugin-api-pdf3           | sv-print plugin-api-pdf3 插件基于 jsPDF 3.x 为打印模板挂载 toPdf 方法导出 PDF，与 plugin-api-pdf 用法完全一致，适合需要 jspdf 3.x 的前端打印项目。                           |
| `/plugin/pw0pl1mt/index.md` | 矢量 PDF 导出 plugin-api-pdf-vector | sv-print plugin-api-pdf-vector 插件基于 WASM 矢量排版导出矢量 PDF，文字可选中、可搜索、可复制，支持中文 TTF 字体嵌入、超链接保留与 ECharts 图表矢量渲染，无限放大不失真。    |
| `/plugin/mtafus1h/index.md` | 长图导出 plugin-api-image           | sv-print plugin-api-image 插件为打印模板挂载 toImage 方法，将打印页面截图纵向拼接导出为长图，支持 JPEG/PNG 格式、多页合并与清晰度、质量自定义，返回 url 或 blob。            |
| `/plugin/do2akt04/index.md` | Excel 导出 plugin-api-excel         | sv-print plugin-api-excel 插件为打印模板挂载 toExcel 方法，将打印页面导出为 xlsx 文件，支持合并单元格与样式保留、图片嵌入、多 Sheet 控制，兼容 Excel、WPS 与 Google Sheets。 |
| `/plugin/75us68iv/index.md` | Word 导出 plugin-api-word           | sv-print plugin-api-word 插件为打印模板挂载 toWord 方法导出 Word 文档，支持原生可编辑与浮动定位两种模式、页级进度回调与 Blob/dataURL 输出，在 Word 中可直接编辑排版。        |
| `/plugin/hd2v8ge3/index.md` | 条码/二维码 bwip-js                 | sv-print plugin-ele-bwip-js 条码二维码打印元素插件，基于 bwip-js 覆盖 100 多种码制，支持 Code 128、EAN、GS1、PDF417、Data Matrix、QR 码等，矢量 SVG 渲染打印清晰。           |
| `/plugin/i5r9n8u0/index.md` | Fabric 文本/画布 fabric             | sv-print plugin-ele-fabric 打印元素插件，基于 Fabric.js 提供 F 文本与自定义画布元素，支持自由绘制图形并输出 SVG，打印与导出矢量无损。                                        |
| `/plugin/zpp4475f/index.md` | ECharts 图表 echarts                | sv-print plugin-ele-echarts 图表打印元素插件，以 SVG 矢量方式渲染 ECharts 图表，打印与导出无损缩放，支持函数字符串配置 eChartsOption 并绑定模板数据。                        |
| `/plugin/vugfo13g/index.md` | Word 转 HTML w2html                 | sv-print plugin-ele-w2html Word 转 HTML 打印元素插件，从 Word 复制内容粘贴到模板自动清洗转换为 HTML，支持长内容自动分页、样式隔离与本地图片转 base64。                       |
| `/plugin/1ivu2s38/index.md` | Excel 粘贴表格 e2table              | sv-print plugin-ele-e2table 插件，从 Excel 复制表格后粘贴到打印模板即可转为可分页打印表格，自动清洗样式并做样式隔离，支持字段占位符绑定打印数据。                            |
| `/plugin/z0j68n6k/index.md` | 可分页 HTML shtml                   | sv-print plugin-ele-shtml 可分页 HTML 打印元素插件，将任意 HTML 长内容按纸张高度自动分页，跨页表格自动补表头表尾，支持分页前细分与自定义分页处理。                           |
| `/plugin/6y39q21t/index.md` | 容器循环渲染 box                    | sv-print plugin-ele-box 容器元素插件，field 绑定数组数据后循环渲染子模板并自动分页，支持占位符模板与可视化设计的 JSON 子模板，适用于明细列表、订单商品行等批量打印场景。     |
| `/plugin/yz5r1juz/index.md` | 静态表格 stable                     | sv-print plugin-ele-stable 静态表格打印元素插件，可视化拖拽设计表格，支持合并拆分单元格、插入文本图片条码二维码、字段占位符绑定打印数据，整表渲染不分页。                    |
| `/plugin/x1mfejc6/index.md` | PDF 渲染 pdf                        | sv-print plugin-ele-pdf 打印元素插件，基于 pdf.js 将 PDF 文件渲染进打印模板，支持 url/base64/dataURL 数据源、页码范围、流式分页、文字叠加层与多级缓存。                      |
| `/plugin/f0yhey5u/index.md` | 骑缝章 seal                         | sv-print plugin-ele-seal 骑缝章打印元素插件，打印时按实际页数自动切分章图并逐页在纸边显示章条，支持左右缝、浮动偏移与盖章页范围，拼合可还原完整印章。                        |
| `/plugin/1v4zj19q/index.md` | 数据格式化 plugin-formatter         | sv-print 数据格式化插件：为打印元素与表格列增加格式化选项，在打印渲染与                                                                                                      |
| `/plugin/xxjtsfin/index.md` | 字号自适应 plugin-text-auto         | sv-print 字号自适应插件：为文本元素增加最小字号选项，在固定盒子内自动缩小字号直到内容不溢出，采用克隆测量与二分查找实现，解决打印模板文字溢出问题。                          |
| `/plugin/ccclbdbt/index.md` | 界面多语言 plugin-i18n              | sv-print 界面多语言插件：基于 i18next 翻译设计器属性面板、参数 tab、右键菜单、预览条等 UI 文案，实现多语言打印设计器界面，支持自定义语言包与运行时切换语言。                 |
| `/plugin/0pt9wmzt/index.md` | 属性控件改写 plugin-options-modify  | sv-print 属性控件改写插件：替换或增强设计器属性面板默认控件，内置 select 转数字输入框、弹窗式单选/多选下拉处理器，支持搭配 Vue、React 组件自定义改写。                       |
| `/plugin/yg911pvj/index.md` | 新手引导 plugin-driver              | sv-print 基于 driver.js 的新手引导插件，设计器挂载后分步高亮界面，引导用户熟悉可视化打印设计器布局与功能入口，支持自定义引导步骤、引导进度缓存与运行时 API。                 |
| `/plugin/vlruvol5/index.md` | 元素缩放 plugin-scale               | sv-print 元素缩放插件：为 text 元素增加缩放选项，通过 CSS transform 实现视觉缩放，不改变元素布局尺寸，适用于打印设计器中的文本缩放展示。                                     |
| `/plugin/3j14hk8a/index.md` | 云打印服务 plugin-cloud             | sv-print 云打印服务插件：接入 sv-print-cloud 云端能力，覆盖可插拔登录（oauth/token/host/local）、服务端渲染、云打印、中转直发打印与设计器内模板中心。                        |
| `/plugin/jb9mbb25/index.md` | 代码编辑器 plugin-view-code-edit    | sv-print 代码编辑器插件：基于 CodeMirror 6 的全屏编辑弹窗，编辑模板 JSON、打印数据、属性函数与自定义元素 JSON，支持语法高亮、查找替换与 hiprint API 代码补全。               |
| `/plugin/csj6erbg/index.md` | 数据源面板 plugin-view-data-source  | sv-print 数据源面板插件：提供字段树与字段选择弹窗，拖拽绑定字段到打印元素与属性参数，支持 JSON 样本、Schema、接口请求等前端数据源配置，无需连接数据库。                      |
| `/plugin/2zbygqjk/index.md` | 元素工具条 plugin-view-ele-tools    | sv-print 元素工具条插件：选中打印元素时显示悬浮工具条，内置字号、对齐、颜色、层级、克隆、删除等默认工具，支持自定义工具集、底部尺寸标签与元素坐标显示。                      |
| `/plugin/682qkmwl/index.md` | AI 助手 plugin-view-ai              | sv-print AI 助手插件：在设计器中通过自然语言对话生成打印模板 JSON 与打印数据并一键应用，支持 AI 生成模板、AI 分析模板、流式响应、工具调用与服务端代理保护 API Key。          |

### 静默/云打印打印客户端

| 路径                        | 标题           | 说明                                                                                                                                                               |
| --------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/client/index.md`          | 打印客户端介绍 | sv-print 打印客户端：基于 Electron 的跨平台静默打印/批量打印客户端，集成可视化模板设计器，支持 socket.io、MQTT、HTTP 三种调用方式与云打印。                        |
| `/client/wtrmay3a/index.md` | 使用示例       | sv-print 打印客户端集成示例：按连接、读取配置、检查配置、设置配置、打印、查询日志的完整流程，提供 socket.io、MQTT、HTTP 三种方式的可落地代码。                     |
| `/client/kf5qw14s/index.md` | HTTP API       | sv-print 打印客户端 HTTP API：47 个 REST 接口，涵盖打印机列表、默认打印机设置、禁用/启用、静默打印、模板管理、配置读写、打印日志查询与重打印。                     |
| `/client/m6xo64g6/index.md` | Socket.IO 通信 | sv-print 打印客户端 Socket.IO 通信：17521 端口 token 鉴权，print/printerList/config 等全量事件说明，支持静默打印、渲染回执、IPP 网络打印与云端中转。               |
| `/client/zonyn521/index.md` | MQTT 通信      | sv-print 打印客户端 MQTT 通信：内置 aedes broker（18521 端口），print/printerList/config 等全部 topic 与消息结构，支持 TCP 与 WebSocket 连接、动态 eventKey 回调。 |
| `/client/ptohqoya/index.md` | 客户端更新日志 |                                                                                                                                                                    |

### Others

| 路径         | 标题                            | 说明                       |
| ------------ | ------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/index.md`  | sv-print - web 可视化打印设计器 | 静默打印·云打印·LODOP 替代 | sv-print 是可扩展的纯前端 web 可视化打印设计器，支持 Vue/React/Svelte/jQuery 多框架接入，零代码设计报表、标签、快递面单、小票模板，导出 PDF/Excel/Word/图片，静默打印、云打印、批量打印，可替代 LODOP 等打印控件。 |
| `/donate.md` | 写文档挺累的~                   |                            |
| `/wechat.md` | 联系我                          |                            |
