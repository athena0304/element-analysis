#  emitter.js


这个文件是 `broadcast` 和 `dispatch` 两个函数

众所周知这两个东西已经在vue 2.x被弃用了 [从 Vue 1.x 迁移 — Vue.js](https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2)

但是为什么element 还要用这两个类似的功能呢，我们继续往下看吧。

这里推荐一篇文章，是和Vue 1.0 的源码做对比的，可以一并看一下：https://www.cnblogs.com/xxcanghai/p/6382607.html

## broadcast
```
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
```
这里要传入三个参数：`componentName` 组件名称，`eventName` 事件名称，`params` 参数

遍历所有的子组件，如果找到名字相同的，就会在这个组件身上触发$emit，事件名称是`eventName`，如果子组件中没有找到，则递归遍历更深层次的组件寻找。