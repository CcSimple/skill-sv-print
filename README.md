# skill-sv-print

可视化打印设计器组件。基于 Svelte 构建，支持 Vue、React、Angular、jQuery 等框架引入。提供拖拽式模板设计、预览、打印、导出 PDF/图片功能，支持插件扩展元素（ECharts、二维码、Fabric等）。

官方文档：[https://www.ibujian.cn/svp/](https://www.ibujian.cn/svp/)

## What is sv-print?

sv-print 是一个功能强大的可视化打印设计&打印解决方案：

- **拖拽式设计器** - 通过拖拽元素快速构建打印模板
- **多框架支持** - Vue 2/3、React、Svelte、Angular、jQuery 均可使用
- **多种打印方式** - 浏览器打印、静默打印、PDF/图片导出
- **插件扩展** - 支持 ECharts、二维码/条形码、Fabric 绘制、Excel 表格等
- **高度可定制** - 支持自定义主题、元素 Provider、UI 组件

## Install Skill

### Step 1: Install the Skills CLI

```bash
npx skills add vercel-labs/agent-skills
```

### Step 2: Install sv-print Skill

```bash
npx skills add https://github.com/CcSimple/skill-sv-print
```

For more information about agent-skills, visit: [https://github.com/vercel-labs/skills](https://github.com/vercel-labs/skills)

### Step 3: Use sv-print Skill

eg: claude code skill sv-print

```bash
/sv-print xxx提示词
```

## AI Prompts

以下是几个常用场景的 AI 提示词示例：

### 场景一：引入设计器

```markdown
使用 sv-print 在 Vue3 中创建模板设计器页面：

1. 在 designer.vue 中引入 Designer 组件
2. 通过路由参数 id 获取模板（如 /designer?id=123）
3. 页面加载时通过 API GET /api/template/:id 获取模板数据并回显
4. header 菜单只保留"保存"和"预览"按钮
5. 保存事件通过 API POST /api/template/save 保存到服务器
```

### 场景二：加载模板实现功能

```markdown
通过 id获取模板json. 创建预览，浏览器打印,直接打印按钮实现打印功能
```

## 问题反馈

1. 提交问题：[https://github.com/CcSimple/skill-sv-print/issues](https://github.com/CcSimple/skill-sv-print/issues)

2. 联系作者：[https://www.ibujian.cn/intro.html#%F0%9F%93%AC-%E8%81%94%E7%B3%BB%E6%88%91](https://www.ibujian.cn/intro.html#%F0%9F%93%AC-%E8%81%94%E7%B3%BB%E6%88%91)

## License

MIT
