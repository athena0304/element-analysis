# alert


第一个组件就从最简单的alert看起吧。
首先每个package里面的组件文件夹中都有一个 `index.js`， 

``` javascript
import Alert from './src/main';

/* istanbul ignore next */
Alert.install = function(Vue) {
  Vue.component(Alert.name, Alert);
};

export default Alert; 
```

应该是如果单独引用这个组件，就注册这个单独的组件。
其中值得一提的是这句 `/* istanbul ignore next */`，这个是一个npm代码覆盖率的工具istanbul [istanbul  -  npm](https://www.npmjs.com/package/istanbul)，在写测试的时候，有些不必要的文件，在计算覆盖率时会被计算到，所以加上这句注释就可以忽略下面的代码。在项目中并不是单独引用的这个包，应该是在测试框架 `Mocha` 中用到的。

下面来看真正的 `main.vue`：

``` html
<template>
  <transition name="el-alert-fade">
    <div
      class="el-alert"
      :class="[typeClass, center ? 'is-center' : '']"
      v-show="visible"
      role="alert"
    >
      <i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <div class="el-alert__content">
        <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
        <slot>
          <p class="el-alert__description" v-if="description">{{ description }}</p>
        </slot>
        <i class="el-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
      </div>
    </div>
  </transition>
</template>
```

首先，最外层是 `transition`，这是Vue提供的组件，可以给下列四种情况添加进入/离开过度：
- 条件渲染（使用 `v-if`）
- 条件展示（使用 `v-show`）
- 动态组件
- 组件根节点
这里的name指定为`el-alert-fade`，这里就要看一下css是如何运作的了。

具体的关于 `transition` 的知识点可以看官方文档 [进入/离开 & 列表过渡 — Vue.js](https://cn.vuejs.org/v2/guide/transitions.html)

找到 `alert.scss`，里面的代码如下：

``` scss
.el-alert-fade-enter,
.el-alert-fade-leave-active {
  opacity: 0;
}
```

可见就是很简单的显示和隐藏，并没有什么过多的特效。

然后继续往下看，`:class="[typeClass, center ? 'is-center' : '']"`用到了 vue 的 class 的数组语法[Class 与 Style 绑定 — Vue.js](https://cn.vuejs.org/v2/guide/class-and-style.html#%E6%95%B0%E7%BB%84%E8%AF%AD%E6%B3%95)。
整个 div 是通过 `v-show="visible"` 来判定显示或隐藏的，初始值在 data 中定义为 true，在后面的 close 函数中置成 false 进行隐藏。

其中计算属性有：

- `typeClass`：通过外部传入的 props 的 type 属性来拼接成 `el-alert--${ this.type }`，默认值为 info
-  `iconClass`：用来判断如果在显示 icon 的情况下，根据 type 来决定显示哪个 icon，默认为 `el-icon-info`
- `isBigIcon`：当有辅助性文字介绍的时候，返回 `is-big`
- `isBoldTitle`：当有辅助性文字介绍的时候，返回 `is-bold`

这里值得一提的是后两个计算属性，里面用到了 `this.$slots.default` 来判断是否是通过 `description` 属性传入的还是通过默认 slot 传入的，如果有值（为 VNode），就设为相应的class，如果为undefined，就为空。

其中的 slot 用的是默认插槽 [插槽 — Vue.js](https://cn.vuejs.org/v2/guide/components-slots.html#%E9%BB%98%E8%AE%A4%E6%8F%92%E6%A7%BD%E7%9A%84%E5%86%85%E5%AE%B9)，如果传入了 `description` 属性，就是使用默认插槽，如果没有传入 `description` ，但是在调用组件的时候外部写了


