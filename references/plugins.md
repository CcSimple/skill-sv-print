# 插件系统

## 官方插件列表

| 插件 | 包名 | 说明 |
|-----|-----|-----|
| 缩放插件 | `@sv-print/plugin-scale` | 文本元素新增缩放属性 |
| 二维码/条形码 | `@sv-print/plugin-ele-bwip-js` | bwip-js 集成，支持 DM 码、GS1-128 码、二维码、条形码 |
| Fabric | `@sv-print/plugin-ele-fabric` | Fabric 绘制集成 |
| ECharts | `@sv-print/plugin-ele-echarts` | ECharts 图表集成 |
| E2Table | `@sv-print/plugin-ele-e2table` | Excel 内容转 HTML 表格 |
| i18n | `@sv-print/plugin-i18n` | 多语言处理 |
| 文本自适应 | `@sv-print/plugin-text-auto` | 自适应字体大小 |
| SHTML | `@sv-print/plugin-ele-shtml` | HTML 分页插件 |
| 格式化 | `@sv-print/plugin-formatter` | 格式化打印数据 |
| 代码编辑 | `@sv-print/plugin-view-code-edit` | 代码编辑插件 |
| toImage | `@sv-print/plugin-api-image` | 模板支持 toImage 方法 |
| toPdf | `@sv-print/plugin-api-pdf` | 模板支持 toPdf 方法 |
| toPdf (jspdf 3.x) | `@sv-print/plugin-api-pdf3` | toPdf 方法（jspdf 3.x） |

## 安装插件

```bash
npm i @sv-print/plugin-ele-bwip-js
npm i @sv-print/plugin-ele-echarts
# 其他插件...
```

## 注册插件

### 方式一：通过组件参数

```vue
<template>
  <Designer :plugins="plugins" />
</template>

<script setup>
import { ref } from 'vue';
import { Designer } from '@sv-print/vue3';
import pluginEleBwip from '@sv-print/plugin-ele-bwip-js';
import pluginEleEcharts from '@sv-print/plugin-ele-echarts';

const plugins = ref([
  pluginEleBwip({}),
  pluginEleEcharts({}),
]);
</script>
```

### 方式二：通过 hiprint.register

```js
import { hiprint } from 'sv-print';
import pluginEleBwip from '@sv-print/plugin-ele-bwip-js';

hiprint.register({
  authKey: '',    // 授权 key
  plugins: [pluginEleBwip({})],
});
```

## 插件详情

### 二维码/条形码插件

```bash
npm i @sv-print/plugin-ele-bwip-js
```

支持类型：QR Code、Data Matrix、Code 128、Code 39、GS1-128、DM 等。

### ECharts 插件

```bash
npm i @sv-print/plugin-ele-echarts
```

```js
import pluginEleEcharts from '@sv-print/plugin-ele-echarts';

const plugins = [pluginEleEcharts({})];
```

### Fabric 插件

```bash
npm i @sv-print/plugin-ele-fabric
```

用于复杂图形绘制。

### 文本自适应插件

```bash
npm i @sv-print/plugin-text-auto
```

自动调整字体大小以适应元素区域。

```js
import pluginTextAuto from '@sv-print/plugin-text-auto';

let plugins = [
  pluginTextAuto({
    sizeList: [12, 5, 4, 3, 2, 1], // 适应最小字体选项
    maxIterations: 15, // 适应次数
    enablePrecision: true, // 启用精确适应
    precision: 0.5, // 适应精确step
    precisionCount: 10, // 适应精确次数
    lineHeightMode: "auto", // 行高模式 auto | original | normal | unset
    overrideHidden: false, // 超出是否隐藏
    extendsCss: {
      // 扩展css
      "word-wrap": "break-word", // 单词换行
    },
  }),
]
```

### 格式化插件

```bash
npm i @sv-print/plugin-formatter
```

格式化打印数据（元素有字段名时触发）。

```js
import pluginFormatter from '@sv-print/plugin-formatter';

const plugins = ref([
  pluginFormatter({
    name: "格式化器", // 参数名称
    funList: [
      {
        name: "转大写", // 展示名称
        key: "toUpperCase", // 格式化器key
        fun: (value) => {
          return `${value}`.toUpperCase();
        },
      },
      {
        name: "自定义",
        key: "test",
        fun: (value) => {
          return `${value}+自定义`;
        },
      },
    ],
  }),
])
```

### i18n 插件

```bash
npm i @sv-print/plugin-i18n
```

多语言支持。

```js
import pluginI18n, {translateBySelector} from "@sv-print/plugin-i18n";
import en from "./i18n/en.json"; // 自己准备多语言文件

const plugins = ref([
  pluginI18n(
    {
      // lng: "英文", // 默认: "简体中文"
      // debug: true, // 调试: 可查看对应语言 缺少的翻译
      resources: {
        // 自定义 key: "英文", 则列表 显示对应的名称
        英文: {
          translation: en,
        },
      },
    },
    (i18next, t, err) => {
      // 回调,干点儿其他的
      console.log("测试翻译", t("文本"));
      // 插件提供的一个 API, 根据 选择器 翻译
      // translateBySelector([".sv-print"]);
    }
  ),
]);
```

### toPdf 插件

```bash
npm i @sv-print/plugin-api-pdf
```

为模板对象添加 toPdf 方法：

```js
import pluginApiPdf from '@sv-print/plugin-api-pdf';

hiprint.register({
  plugins: [pluginApiPdf()],
});

// 使用
await printTemplate.toPdf(printData, 'filename.pdf');
```

### toImage 插件

```bash
npm i @sv-print/plugin-api-image
```

为模板对象添加 toImage 方法：

```js
import pluginApiImage from '@sv-print/plugin-api-image';

hiprint.register({
  plugins: [pluginApiImage()],
});

// 使用
await printTemplate.toImage(printData);
```
