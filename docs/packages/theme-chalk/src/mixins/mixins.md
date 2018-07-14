#  packages/theme-chalk/src/mixins
#element/源码

## `config.scss`
这个文件是源头，定义了一些命名空间等原始的值：

``` scss
$namespace: 'el'; // 命名空间
$element-separator: '__'; // 元素之间的分隔符
$modifier-separator: '--'; // 修饰符分隔符
$state-prefix: 'is-'; // 状态前缀
```

## `function.scss`

## `mixin.scss`
###  `b`

``` scss
@mixin b($block) {
  $B: $namespace+'-'+$block !global;

  .#{$B} {
    @content;
  }
}
```

将局部变量转换为全局变量可以添加 `!global` 声明

如果传入的 $block 是 alert，那么解析后就是：

```
@mixin b($block) {
  .el-alert {
    @content;
  }
}
```

也就是说b的作用就是把传进来的组件名拼接成 el命名空间的选择符。
`#{$B}` 是一种插值写法，最终解析出来的就是`el-alert`

### `when`

``` scss
@mixin when($state) {
  @at-root {
    &.#{$state-prefix + $state} {
      @content;
    }
  }
}
```

这里是 @at-root 官网[File: SASS_REFERENCE — Documentation by YARD 0.9.12](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#at-root) 的解释，` @at-root` 指令可以将一条或者多条规则注册在文档的根目录，而不用限制在父选择器内。

那么这段翻译过来就是：

``` scss
&.is-center {
      @content;
    }

/* 以 alert 举例：*/
@include when(center) {
    justify-content: center;
  }
/* 最终：*/
.el-alert.is-center {
    justify-content: center;
}
```

所以总结一下，这个 `when`  的 `mixin` 就是给传入的类名字段加一个 `is-`前缀

### `m`

``` scss
@mixin m($modifier) {
  $selector: &;
  $currentSelector: "";
  @each $unit in $modifier {
    $currentSelector: #{$currentSelector + & + $modifier-separator + $unit + ","};
  }

  @at-root {
    #{$currentSelector} {
      @content;
    }
  }
}
```

这里用到了 @each 指令 [File: SASS_REFERENCE — Documentation by YARD 0.9.12](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#each-directive)，解析过后就是
``` scss
$currentSelector: #{$currentSelector + & + $modifier-separator + $unit + ","};
$currentSelector: #{&--success,};
```


``` scss
@include m(success) {
    background-color: $--alert-success-color;
    color: $--color-success;

    .el-alert__description {
      color: $--color-success;
    }
  }

.el-alert--success {
    background-color: #f0f9eb;
    color: #67c23a;
}
.el-alert--success .el-alert__description {
    color: #67c23a;
}
```

所以这个 m 对应的就是加修饰符的操作

解析到这，有没有发现什么，mixin 对应的 b、e、m 对应的就是那个传说中的 BEM，我们解析了b和m，b就是为了加上block，m是为了加上后面的修饰符，e应该也就是为了添加元素，最终拼成BEM的格式。

## e
``` scss
@mixin e($element) {
  $E: $element !global;
  $selector: &;
  $currentSelector: "";
  @each $unit in $element {
    $currentSelector: #{$currentSelector + "." + $B + $element-separator + $unit + ","};
  }

  @if hitAllSpecialNestRule($selector) {
    @at-root {
      #{$selector} {
        #{$currentSelector} {
          @content;
        }
      }
    }
  } @else {
    @at-root {
      #{$currentSelector} {
        @content;
      }
    }
  }
}
```

前半段解析为：

``` scss
$currentSelector: #{$currentSelector + "." + $B + $element-separator + $unit + ","};
$currentSelector: #{.el-alert__content,};
```

后面几句用到了 `@function` 指令 [File: SASS_REFERENCE — Documentation by YARD 0.9.12](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#function_directives)，意思是说如果有 containsModifier、containWhenFlag、containPseudoClass，就在外层再加一个 `#{$selector}`

举例：

``` scss
@include e(content) {
    display: table-cell;
    padding: 0 8px;
  }

.el-alert__content {
    display: table-cell;
    padding: 0 8px;
}
```
