# Designer 设计器组件

## 组件参数

### 基础参数

| 参数          | 类型     | 默认值                | 说明           |
| ------------- | -------- | --------------------- | -------------- |
| template      | object   | {}                    | 模板 JSON 数据 |
| printData     | object   | {}                    | 打印预览数据   |
| templateKey   | string   | default-template      | 缓存键         |
| title         | string   | 默认模板              | 导出文件名     |
| designOptions | object   | { grid, activePanel } | 设计参数       |
| paperList     | string[] | 默认纸张列表          | 可选纸张列表   |
| config        | object   | {}                    | 配置参数       |
| plugins       | object[] | []                    | 插件列表       |
| authKey       | string   | ''                    | 授权 key       |

### 设计器函数重写

| 参数               | 类型     | 说明                     |
| ------------------ | -------- | ------------------------ |
| events             | object   | 保存、编辑、快捷键等事件 |
| onPreviewClick     | function | 预览按钮点击事件         |
| onImageChooseClick | function | 图片选择点击事件         |
| onPanelAddClick    | function | 多面板新增点击事件       |
| onFunctionClick    | function | 函数/textarea 点击事件   |
| onZoomChange       | function | 缩放回调                 |
| customDataFun      | function | 自定义字段数据获取       |
| onBeforeDragIn     | function | 元素拖入前回调           |

### 设计器回调

```vue
<template>
  <div style="height: 100vh;">
    <Designer @onDesigned="onDesigned" />
  </div>
</template>

<script setup>
const onDesigned = (e) => {
  const { hiprint, designerUtils } = e.detail;
  // designerUtils.printTemplate - 模板对象
  // designerUtils.printData - 打印数据
};
</script>
```

### 事件回调

```js
const events = {
  // 保存模板
  onSave: (key, data) => {
    console.log('保存', key, data);
    return true; // 返回 true 阻止冒泡
  },
  // 编辑模板
  onEdit: (data) => {
    console.log('编辑', data);
    return true;
  },
  // 编辑打印数据
  onEditData: (data) => {
    console.log('编辑数据', data);
    return true;
  },
  // 快捷键
  onKeyDownEvent: (e, utils) => {
    console.log('快捷键', e);
    return true;
  },
};
```

### 纸张列表

```js
const paperList = [
  { type: 'A4', width: 210, height: 297 },
  { type: 'A3', width: 297, height: 420 },
  { type: 'A5', width: 148, height: 210 },
  // 自定义纸张...
];
```

### 配置参数

```js
const config = {
  showAdsorbLine: true, // 显示吸附线
  showPosition: true, // 显示元素位置
  showSizeBox: true, // 显示大小框
};

hiprint.setConfig(config);
```

### 自定义主题

```ts
interface themeType {
  theme?: string;
  primaryColor: string;
  primaryContent?: string;
  secondaryColor?: string;
  secondaryContent?: string;
  accentColor?: string;
  accentContent?: string;
  neutralColor?: string;
  neutralContent?: string;
  base100?: string;
  base200?: string;
  base300?: string;
  baseContent?: string;
  info?: string;
  infoContent?: string;
  success?: string;
  successContent?: string;
  warning?: string;
  warningContent?: string;
  error?: string;
  errorContent?: string;
}

const themeList = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];
```

### 预览参数

```js
const previewOptions = {
  showPdf: true, // 显示导出 PDF
  showImg: true, // 显示导出图片
  showPrint2: true, // 显示直接打印
};
```

### UI 显示控制

```js
const showOption = {
  showHeader: true, // 显示顶部 Header
  showToolbar: true, // 显示工具栏
  showFooter: true, // 显示底部 Footer
};
```

### 标尺样式

```js
const rulerStyle = {
  show: true,
  size: 24,
  backgroundColor: '#fff',
  fontSize: 12,
  fontColor: '#1f1f1f',
  fontMode: 'right',
  gap: 3.78,
  tickColor: '#1f1f1f',
  unitMode: 'mm',
  border: true,
  borderColor: '#1f1f1f',
  paperRect: true,
  paperRectColor: '#f5f5f5',
};
```

### Provider 参数

```js
// 定义 provider
export default function (options) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes('customModule');
    context.addPrintElementTypes('customModule', [
      new hiprint.PrintElementTypeGroup('自定义', [
        {
          tid: 'customModule.text',
          type: 'text',
          title: '自定义文本',
          options: {
            title: '文本标题',
            field: 'text',
            testData: '测试',
          },
        },
      ]),
    ]);
  };
  return { addElementTypes };
}
```

### Provider Map

```js
const providerMap = {
  container: '.hiprintEpContainer',
  value: 'defaultModule',
  render: (list) => {
    // 自定义渲染逻辑
    let container = $('<div class="hiprint-printElement-type"></div>');
    list.forEach((item) => {
      const box = $(`<div class="hiprint-printElement-type-group">
        <span class="title">${item.name}</span>
        <div class="list"></div>
      </div>`);
      item.printElementTypes.forEach((t) => {
        box.find('.list').append(`<div class="draggable-ele" tid="${t.tid}">
          <i class="svicon sv-${t.type}"></i>
          <p>${t.getText()}</p>
        </div>`);
      });
      container.append(box);
    });
    return container;
  },
};
```

### 组件插槽

| 插槽         | 说明             |
| ------------ | ---------------- |
| header       | 顶部 Header      |
| toolbar      | 工具栏           |
| draggableEls | 左侧拖拽元素区域 |
| other        | 其他位置         |

### Header 自定义

```vue
<template>
  <div style="height: 100vh;">
    <Designer
      headerLogoHtml="<i class='svp-header-logo svicon sv-print'></i>"
      headerTitle="sv-print"
      :headerNewEle="false"
      :headerEleList="headerEleList"
      :headerNewMenu="false"
      :headerMenuList="headerMenuList"
    />
  </div>
</template>

<script setup>
const headerEleList = ref([
  { gap: true },
  {
    icon: 'sv-base',
    title: '基础',
    children: [{ type: 'defaultModule.hline', icon: 'sv-hline', title: '横线' }],
  },
]);

const headerMenuList = ref([
  {
    icon: 'sv-browser',
    title: '保存',
    desc: 'Ctrl + S',
    click: (util) => util.save(),
  },
]);
</script>
```

### 样式位置配置

```js
const styleOption = {
  panels: { mode: 'left', style: 'left:28%;top:100px;' },
  draggableEls: { mode: 'default', show: true, style: 'left:20px;' },
  options: { mode: 'default', style: 'right:0;top:95px;' },
  pageStructure: { mode: 'default', style: 'right:210px;top:95px;' },
  miniMap: { mode: 'default', style: 'left:20px;bottom:30px;' },
  editableTools: { mode: 'top', style: 'left:280px;top:180px;' },
  zIndexTools: { mode: 'top', style: 'left:280px;top:300px;' },
  fontTools: { mode: 'top', style: 'left:280px;top:420px;' },
  zoomTools: { mode: 'left', style: 'left:240px;top:100px;' },
  rotateTools: { mode: 'bottom', style: 'left:440px;top:180px;' },
};
```

### 框架引入示例

**Vue 3**

```vue
<template>
  <div style="height: 100vh;">
    <Designer :template="template" @onDesigned="onDesigned" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Designer } from '@sv-print/vue3';

const template = ref({});
const onDesigned = (e) => {
  const { hiprint, designerUtils } = e.detail;
};
</script>
```

**React**

```jsx
import { Designer } from '@sv-print/react';

function App() {
  const [template, setTemplate] = useState({});

  return (
    <div style="height: 100vh;">
      <Designer
        template={template}
        onDesigned={(e) => {
          const { hiprint, designerUtils } = e.detail;
        }}
      />
    </div>
  );
}
```

**Vanilla JS**

```js
import { Designer } from 'sv-print';

const designer = new Designer({
  target: document.body,
  props: { template: {} },
});

designer.$on('onDesigned', (e) => {
  const { hiprint, designerUtils } = e.detail;
});
```
