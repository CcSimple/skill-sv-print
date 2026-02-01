# 模板 JSON 数据格式

模板 JSON 是 sv-print 的核心数据格式，用于生成打印模板。

## 基本结构

```js
{
  panels: [
    {
      index: 0,
      name: '面板0',
      height: 297,      // 面板高度，单位 mm
      width: 210,       // 面板宽度，单位 mm
      paperHeader: 49.5,    // 页眉线，单位 pt
      paperFooter: 780,     // 页脚线，单位 pt
      printElements: [],    // 打印元素列表
      paperNumberLeft: 565.5,   // 页码左边距
      paperNumberTop: 819,      // 页码上边距
      paperNumberContinue: true,    // 多面板页码续排
      paperNumberDisabled: true,    // 禁用页码
      paperNumberFormat: '${paperNo}-${paperCount}',   // 页码格式
      backgroundColor: '#f1ebff',    // 背景颜色
      orient: 1,     // 打印方向：1-纵向，2-横向
      overPrintOptions: {        // 套打功能
        content: '',
        opacity: 0.7,
        type: 1,
      },
      watermarkOptions: {         // 水印配置
        content: 'sv-print',
        fillStyle: 'rgba(87, 13, 248, 0.5)',
        fontSize: '36px',
        rotate: 25,
        width: 413,
        height: 310,
        timestamp: true,
        format: 'YYYY-MM-DD HH:mm',
      },
      panelLayoutOptions: {       // 排列填充
        layoutType: 'column',     // column-纵向，row-横向
        layoutRowGap: 0,
        layoutColumnGap: 0,
      },
    },
  ],
}
```

## 打印元素结构

```js
{
  printElements: [
    {
      options: {
        left: 439.5,      // 元素左边距，单位 pt
        top: 10.5,        // 元素上边距，单位 pt
        height: 33,       // 元素高度，单位 pt
        width: 150,       // 元素宽度，单位 pt
        title: '文本标题',
        fontSize: 12,     // 字体大小，单位 pt
        // 其他属性...
      },
      printElementType: {
        title: '文本',    // 拖拽时显示的标题
        type: 'text',     // 元素类型
      },
    },
  ],
}
```

## 元素类型

内置元素类型：

| 类型 | 说明 |
|-----|-----|
| `text` | 文本（可配置为二维码、条形码） |
| `image` | 图片 |
| `longText` | 长文本（内容超面板高度自动分页） |
| `table` | 表格（内容超面板高度自动分页） |
| `html` | HTML 内容 |
| `hline` | 横线 |
| `vline` | 竖线 |
| `rect` | 矩形 |
| `oval` | 椭圆 |

## 单位说明

- 面板尺寸：`mm`
- 元素位置和大小：`pt`

## 字段绑定

元素支持 `field` 字段绑定，用于从打印数据中获取值：

```js
{
  options: {
    field: 'customer.name',    // 从 printData.customer.name 获取数据
    title: '客户名称',
  },
}
```

## 导入导出

```js
// 导出模板
const json = designerUtils.printTemplate.getJson();

// 导入模板
designerUtils.printTemplate.update(json);
```
