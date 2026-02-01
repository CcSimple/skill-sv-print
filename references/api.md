# 全局对象与 API

## 全局对象

暴露在 `window` 上的全局对象：

| 对象             | 说明                                    |
| ---------------- | --------------------------------------- |
| `hiprint`        | 核心对象：创建模板、打印、provider 管理 |
| `hiwebSocket`    | 打印客户端连接                          |
| `hinnn`          | 工具类                                  |
| `HIPRINT_CONFIG` | 全局配置                                |

## hiprint API

### 创建模板对象

```js
const printTemplate = new hiprint.PrintTemplate({
  template: templateJson, // 模板 JSON
});
```

### 打印相关

```js
const printData = { name: '不简' };

// 偏移设置: 不同PC 同一个打印机可能存在偏移  单位: mm
let offsetOption = { leftOffset: -1, topOffset: -1 };

// 浏览器打印（弹出打印对话框）
await printTemplate.print(printData, { ...offsetOption });

// 静默打印（需要打印客户端）
await printTemplate.print2(printData, { ...offsetOption });

// 批量打印
await printTemplate.print([data1, data2, data3], { ...offsetOption });

// 获取预览 HTML
const jqueryObj = await printTemplate.getHtml(printData, { ...offsetOption });
const html = jqueryObj.html();
```

### 多模板操作

```js
const printTemplate2 = new hiprint.PrintTemplate({ template: template2 });

// 多模板预览
const jqueryObj = await hiprint.getHtml({
  templates: [
    { template: printTemplate, data: printData },
    { template: printTemplate2, data: [data1, data2] },
  ],
});

// 多模板打印
await hiprint.print({
  templates: [
    { template: printTemplate, data: printData },
    { template: printTemplate2, data: [data1, data2] },
  ],
});

// 多模板静默打印
await hiprint.print2(
  {
    templates: [{ template: printTemplate, data: printData, options: {} }],
    options: { printer: '', landscape: true },
  }
);
```

### Provider 管理

```js
// 定义 provider
new hiprint.PrintElementTypeGroup('辅助', [
  { tid: 'testModule.hline', title: '横线', type: 'hline' },
]);

// 初始化 provider
hiprint.init({ providers: [customProvider()] });

// 查看所有元素类型
console.log(hiprint.ElementTypes.allElementTypes);

// 更新元素类型
hiprint.updateElementType('defaultModule.text', (type) => {
  type.title = '更新后的标题';
  return type;
});

// 构建可拖拽元素到容器
hiprint.PrintElementTypeManager.build('.hiprintEpContainer', 'moduleName');

// 通过 HTML 初始化拖拽
hiprint.PrintElementTypeManager.buildByHtml($('.draggable-item'));
```

### 注册插件

```js
import pluginEleBwip from '@sv-print/plugin-ele-bwip-js';

hiprint.register({
  authKey: '', // 授权 key
  plugins: [pluginEleBwip({})],
});
```

### 其他 API

```js
// 刷新打印机列表
const list = await hiprint.refreshPrinterList();

// 获取地址信息
const addr = await hiprint.getAddress();

// 获取客户端信息
const info = await hiprint.getClientInfo();

// 获取连接列表
const clients = await hiprint.getClients();

// IPP 打印
hiprint.ippPrint(options, callback, connectedCallback);
```

## hiwebSocket API

### 连接管理

```js
// 检查连接状态
console.log(hiwebSocket.opened);

// 获取连接地址
console.log(hiwebSocket.host);

// 断开连接
await hiwebSocket.stop();

// 设置连接
await hiwebSocket.setHost('http://localhost:17521', 'token');
```

### 发送打印数据

```js
// 打印 URL PDF
hiwebSocket.send({ pdf_path: 'https://xxx.pdf', type: 'url_pdf' });

// 打印 HTML
hiwebSocket.send({ html: '<div>内容</div>' });

// 模板打印
hiwebSocket.send({
  template: { panels: [...] },
  printData: { name: '张三' },
});

// 监听回调
hiwebSocket.socket.on('success', (data) => console.log(data));
hiwebSocket.socket.on('error', (e) => console.log(e));
```

## hinnn 工具类

### 事件

```js
// 触发事件
hinnn.event.trigger('eventName', data);

// 监听
hinnn.event.on('eventName', (data) => {});

// 移除监听
hinnn.event.off('eventName', callback);

// 清空
hinnn.event.clear('eventName');
```

### 单位转换

```js
// pt 转换
hinnn.pt.toPx(10);
hinnn.pt.toMm(10);

// px 转换
hinnn.px.toPt(10);
hinnn.px.toMm(10);

// mm 转换
hinnn.mm.toPx(10);
hinnn.mm.toPt(10);
```

### 数字转大写

```js
hinnn.toUpperCase('0', 10.8); // 十点八
hinnn.toUpperCase('5', 10.8); // 人民币壹拾元捌角
hinnn.toUpperCase('7', 10.8); // 壹拾元捌角零分
```

### 日期格式化

```js
hinnn.dateFormat(new Date(), 'yyyy/MM/dd');
```

### 节流防抖

```js
hinnn.throttle(() => {}, 200)();
hinnn.debounce(() => {}, 200)();
```
