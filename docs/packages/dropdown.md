# dropdown


`dropdown`分为了三个部分（文件）：`dropdown`, `dropdown-menu`, `dropdown-item`，其中`dropdown-item`是非常独立的组件

## dropdown.vue
这个文件一打开没有 template ，应该就知道是用 render 来渲染的。所以往下找果然有render函数，从这里开始看吧：
首先用 ES6 解构的方式定义了几个函数和变量
``` js
let { hide, splitButton, type, dropdownSize } = this;
```
从 return 返回的格式来看是使用了 JSX 语法格式  [渲染函数 & JSX — Vue.js](https://cn.vuejs.org/v2/guide/render-function.html#JSX)：
```
<div class="el-dropdown" v-clickoutside={hide}>
   {triggerElm}
   {this.$slots.dropdown}
</div>
```

`v-clickoutside` 是自定义指令，下面来重点看一下 `triggerElm` 里面是什么：
``` javascript
let triggerElm = !splitButton
        ? this.$slots.default
        : (<el-button-group>
          <el-button type={type} size={dropdownSize} nativeOn-click={handleMainButtonClick}>
            {this.$slots.default}
          </el-button>
          <el-button ref="trigger" type={type} size={dropdownSize} class="el-dropdown__caret-button">
            <i class="el-dropdown__icon el-icon-arrow-down"></i>
          </el-button>
        </el-button-group>);
```



> 设置split-button属性来让触发下拉元素呈现为按钮组，左边是功能按钮，右边是触发下拉菜单的按钮，设置为true即可。 https://jsfiddle.net/api/post/library/pure/  


如果 splitButton 为 true，则渲染冒号后面那一大坨，如果为 false，则正常渲染`this.$slots.default` 的内容就行了。而冒号后面那一大坨是引入了 `ElButton`和`ElButtonGroup`，在主 button上绑定了一个原生的点击事件`nativeOn-click={handleMainButtonClick}`，在函数开头的地方定义了：

``` js
const handleMainButtonClick = (event) => {
        this.$emit('click', event);
        hide();
      };
```

点击按钮，触发 click 事件， 供外部绑定调用
然后再说这个 hide 函数：

``` js
hide() {
        if (this.triggerElm.disabled) return;
        this.removeTabindex();
        this.resetTabindex(this.triggerElm);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.visible = false;
        }, this.trigger === 'click' ? 0 : this.hideTimeout);
      },
```

这个就是把原本应该触发的下拉框给隐藏掉。

然后再看 mounted ：

``` js
 mounted() {
    this.$on('menu-item-click', this.handleMenuItemClick);
    this.initEvent();
    this.initAria();
 },
```

首先监听了 `menu-item-click` 事件，这个是在子组件中如果有触发，就会调用 `this.handleMenuItemClick`：
``` js
handleMenuItemClick(command, instance) {
    if (this.hideOnClick) {
      this.visible = false;
    }
    this.$emit('command', command, instance);
},
```

| hide-on-click | 是否在点击菜单项后隐藏菜单     | boolean          | — | true |

在这里，要先了解一下所有的属性：

### Dropdown Attributes
| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| type          | 菜单按钮类型，同 Button 组件(只在`split-button`为 true 的情况下有效)   | string  |          —             |    —     |
| size          | 菜单尺寸，在`split-button`为 true 的情况下也对触发按钮生效  | string | medium / small / mini | — |
| split-button  | 下拉触发元素呈现为按钮组    | boolean  |    —  |  false |
| placement    | 菜单弹出位置     | string | top/top-start/top-end/bottom/bottom-start/bottom-end  | bottom-end |
| trigger       | 触发下拉的行为     | string          | hover, click  | hover |
| hide-on-click | 是否在点击菜单项后隐藏菜单     | boolean          | — | true |
| show-timeout  | 展开下拉菜单的延时（仅在 trigger 为 hover 时有效）| number          | — | 250 |
| hide-timeout  | 收起下拉菜单的延时（仅在 trigger 为 hover 时有效）| number          | — | 150 |

然后再看 `this.initEvent();` 都做了些什么

``` js
initEvent() {
	// oxw:用解构的方式定义局部变量
  let { trigger, show, hide, handleClick, splitButton, handleTriggerKeyDown, handleItemKeyDown } = this;
  this.triggerElm = splitButton
    ? this.$refs.trigger.$el
    : this.$slots.default[0].elm;

  let dropdownElm = this.dropdownElm = this.$slots.dropdown[0].elm;

  this.triggerElm.addEventListener('keydown', handleTriggerKeyDown); // triggerElm keydown
  dropdownElm.addEventListener('keydown', handleItemKeyDown, true); // item keydown
  // 控制自定义元素的样式
  if (!splitButton) {
    this.triggerElm.addEventListener('focus', () => {
      this.focusing = true;
    });
    this.triggerElm.addEventListener('blur', () => {
      this.focusing = false;
    });
    this.triggerElm.addEventListener('click', () => {
      this.focusing = false;
    });
  }
  if (trigger === 'hover') {
    this.triggerElm.addEventListener('mouseenter', show);
    this.triggerElm.addEventListener('mouseleave', hide);
    dropdownElm.addEventListener('mouseenter', show);
    dropdownElm.addEventListener('mouseleave', hide);
  } else if (trigger === 'click') {
    this.triggerElm.addEventListener('click', handleClick);
  }
}
```

这里的 `this.triggerElm` 会有三种情况

``` html
<span class="el-dropdown-link el-dropdown-selfdefine" aria-haspopup="list" aria-controls="dropdown-menu-2504" role="button" tabindex="0">
    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i></span>

<button type="button" class="el-button el-button--primary el-dropdown-selfdefine" aria-haspopup="list" aria-controls="dropdown-menu-4994" role="button" tabindex="0"><!----><!----><span>
    更多菜单<i class="el-icon-arrow-down el-icon--right"></i></span></button>

<button type="button" class="el-button el-button--primary el-dropdown__caret-button" aria-haspopup="list" aria-controls="dropdown-menu-4813"><!----><!----><span><i class="el-dropdown__icon el-icon-arrow-down"></i></span></button>
```

一种是文本，一种是按钮，一种是按钮组右边的触发下拉菜单的按钮

整体说下来这个函数就是给下拉列表和触发按钮绑定一些事件，比如键盘选中、上下切换、esc时间，以及给 hover 模式绑定 mouseenter 和 mouseleave 事件，给 click 模式绑定 click 事件。

加入我们点击触发按钮，就会进入：
``` js
handleClick() {
  if (this.triggerElm.disabled) return;
  if (this.visible) {
    this.hide();
  } else {
    this.show();
  }
}
```

如果按钮被禁用则什么都不做，如果是正常状态，根据显示状态进行显示/隐藏。

然后在 mounted 函数中还调用了 initAria 函数：

``` js
initAria() {
  this.dropdownElm.setAttribute('id', this.listId);
  this.triggerElm.setAttribute('aria-haspopup', 'list');
  this.triggerElm.setAttribute('aria-controls', this.listId);
  this.menuItems = this.dropdownElm.querySelectorAll("[tabindex='-1']");
  this.menuItemsArray = Array.prototype.slice.call(this.menuItems);

  if (!this.splitButton) { // 自定义
    this.triggerElm.setAttribute('role', 'button');
    this.triggerElm.setAttribute('tabindex', '0');
    this.triggerElm.setAttribute('class', (this.triggerElm.getAttribute('class') || '') + ' el-dropdown-selfdefine'); // 控制
  }
}
```

这里初始化了一些元素的aria相关的东西，具体可以看张鑫旭的这篇文章：[WAI-ARIA无障碍网页应用属性完全展示 «  张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2012/03/wai-aria-%E6%97%A0%E9%9A%9C%E7%A2%8D%E9%98%85%E8%AF%BB/)

这个模块大致都清楚了，让我们先看一下里面的 `dropdown-menu`

## dropdown-menu.vue

