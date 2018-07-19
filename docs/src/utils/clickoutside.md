# clickoutside

自定义指令，需要就着vue的文档来看：

文中用到了三个指令：

### bind

> 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

```js
bind(el, binding, vnode) {
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
        id,
        documentHandler: createDocumentHandler(el, binding, vnode),
        methodName: binding.expression, // 字符串形式的指令表达式
        bindingFn: binding.value // 指令的绑定值
    };
},
```

