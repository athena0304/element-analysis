#  emitter.js


这个文件是 `broadcast` 和 `dispatch` 两个函数

众所周知这两个东西已经在vue 2.x被弃用了 [从 Vue 1.x 迁移 — Vue.js](https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2)

但是为什么element 还要用这两个类似的功能呢，我们继续往下看吧。

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