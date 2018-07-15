# directives


## `mousewheel.js`
引用了第三方npm包 `normalize-wheel` [normalize-wheel  -  npm](https://www.npmjs.com/package/normalize-wheel)
这个包是来自 Facebook 的 [FixedDataTable](http://schrodinger.github.io/fixed-data-table-2/)
源码在这里[GitHub - basilfx/normalize-wheel: Mouse wheel normalization across multiple multiple browsers.](https://github.com/basilfx/normalize-wheel)

粗略看下来是对浏览器对于滚轮事件的统一和兼容

使用的话如下：
``` javascript
import normalizeWheel from 'normalize-wheel';
 
document.addEventListener('mousewheel', function (event) {
    const normalized = normalizeWheel(event);
 
    console.log(normalized.pixelX, normalized.pixelY);
});
```

在 element中用到的地方在 `table.vue` 中
使用了自定义指令 `v-mousewheel="handleFixedMousewheel`  和 `v-mousewheel="handleHeaderFooterMousewheel"`
两个函数里面是这样的：

``` javascript
handleHeaderFooterMousewheel(event, data) {
  const { pixelX, pixelY } = data;
  if (Math.abs(pixelX) >= Math.abs(pixelY)) {
    event.preventDefault();
    this.bodyWrapper.scrollLeft += data.pixelX / 5;
  }
}

handleFixedMousewheel(event, data) {
  const bodyWrapper = this.bodyWrapper;
  if (Math.abs(data.spinY) > 0) {
    const currentScrollTop = bodyWrapper.scrollTop;
    if (data.pixelY < 0 && currentScrollTop !== 0) {
      event.preventDefault();
    }
    if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
      event.preventDefault();
    }
    bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
  } else {
    bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
  }
}
```

这里面具体干啥的，后面看到table再看吧，但是肯定是跟fix的滚轮有关。

## `repeat-click.js`
顾名思义，肯定是跟重复点击相关。
代码如下：
``` javascript
import { once, on } from 'element-ui/src/utils/dom';

export default {
  bind(el, binding, vnode) {
    let interval = null;
    let startTime;
    const handler = () => vnode.context[binding.expression].apply();
    const clear = () => {
      if (new Date() - startTime < 100) {
        handler();
      }
      clearInterval(interval);
      interval = null;
    };

    on(el, 'mousedown', (e) => {
      if (e.button !== 0) return;
      startTime = new Date();
      once(document, 'mouseup', clear);
      clearInterval(interval);
      interval = setInterval(handler, 100);
    });
  }
};

```

当按钮点击加号或者减号的时候，如果你一直按住不放，会一直增加或者递减，而这个时间间隔是在100ms变一次，检测到 `mouseup` 后就会停止计时，并且清空计时器。

这里有个小细节：上述代码中有两个地方用到了 `clearInterval(interval)` ，下面的只是重置了 `interval`，而在 `clear` 中，又加了一句 `interval = null`，彻底清除 `interval`。

然后这里检测`mouseup`事件用的 `once`，然而我换成 `on` 效果是一样的，这个 `once` 函数是这样的：

``` javascript
export const once = function(el, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};
```
 这个意思应该是说如果有fn回调函数，就执行，如果没有，就解绑这个事件。







