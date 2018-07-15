# migrating.js


> 版本迭代的过程中，若 API 发生变化，如何友好地提示用户  

> 在历次迭代中，我们会尽量保持 API 的一致。但是在一些万不得已的情况下，需要对 API 作出一些更新。对于老版本的用户而言，如果使用了被移除的 API，升级到新版后会出现一些意料之外的报错信息。为了友好地帮助用户尽快找到报错的来源，我们编写了一个 `mixin` ，当组件的 API 发生变化时，在组件中引入这个 `mixin` 并列出变化前后的字段名即可。  


以 dropdown 组件举例，在文件中引入了这个文件，并定义了方法：
``` js
getMigratingConfig() {
        return {
          props: {
            'menu-align': 'menu-align is renamed to placement.'
          }
        };
      }
```

然后如果我在开发环境加上 `menu-align="right"`，那么浏览器的console就会报一条提示：

> [Element Migrating][ElDropdown][Attribute]: menu-align is renamed to placement.  

核心代码如下：
``` js
mounted() {
    if (process.env.NODE_ENV === 'production') return;
    if (!this.$vnode) return;
    const { props = {}, events = {} } = this.getMigratingConfig();
    const { data, componentOptions } = this.$vnode;
    const definedProps = data.attrs || {};
    const definedEvents = componentOptions.listeners || {};

    for (let propName in definedProps) {
      if (definedProps.hasOwnProperty(propName) && props[propName]) {
        console.warn(`[Element Migrating][${this.$options.name}][Attribute]: ${props[propName]}`);
      }
    }

    for (let eventName in definedEvents) {
      if (definedEvents.hasOwnProperty(eventName) && events[eventName]) {
        console.warn(`[Element Migrating][${this.$options.name}][Event]: ${events[eventName]}`);
      }
    }
  }
```

就是在组件 mounted 的时候判断定义的属性和事件是否和外面传入的一致，如果不一致根据分类提示不同的信息





