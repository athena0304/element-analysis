# alert.scss
#element/源码

分析完 alert 的html 和 js， 该了解一下scss 在 element 里是怎样应用的了。

首先，该文件 import 了两个文件：

``` scss
@import "mixins/mixins";
@import "common/var";
```

后面的代码如下：
``` scss
@include b(alert) {
  width: 100%;
  padding: $--alert-padding;
  margin: 0;
  box-sizing: border-box;
  border-radius: $--alert-border-radius;
  position: relative;
  background-color: $--color-white;
  overflow: hidden;
  opacity: 1;
  display: flex;
  align-items: center;
  transition: opacity .2s;

  @include when(center) {
    justify-content: center;
  }

  @include m(success) {
    background-color: $--alert-success-color;
    color: $--color-success;

    .el-alert__description {
      color: $--color-success;
    }
  }

  @include m(info) {
    background-color: $--alert-info-color;
    color: $--color-info;

    .el-alert__description {
      color: $--color-info;
    }
  }

  @include m(warning) {
    background-color: $--alert-warning-color;
    color: $--color-warning;

    .el-alert__description {
      color: $--color-warning;
    }
  }

  @include m(error) {
    background-color: $--alert-danger-color;
    color: $--color-danger;

    .el-alert__description {
      color: $--color-danger;
    }
  }

  @include e(content) {
    display: table-cell;
    padding: 0 8px;
  }

  @include e(icon) {
    font-size: $--alert-icon-size;
    width: $--alert-icon-size;
    @include when(big) {
      font-size: $--alert-icon-large-size;
      width: $--alert-icon-large-size;
    }
  }

  @include e(title) {
    font-size: $--alert-title-font-size;
    line-height: 18px;
    @include when(bold) {
      font-weight: bold;
    }
  }

  & .el-alert__description {
    font-size: $--alert-description-font-size;
    margin: 5px 0 0 0;
  }

  @include e(closebtn) {
    font-size: $--alert-close-font-size;
    color: $--color-text-placeholder;
    opacity: 1;
    position: absolute;
    top: 12px;
    right: 15px;
    cursor: pointer;

    @include when(customed) {
      font-style: normal;
      font-size: $--alert-close-customed-font-size;
      top: 9px;
    }
  }
}

.el-alert-fade-enter,
.el-alert-fade-leave-active {
  opacity: 0;
}
```

如果把这段代码人肉一点点解析出来，解析成普通的scss，就是下面的：
``` scss
.el-alert {
  width: 100%;
  padding: 8px 16px;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  opacity: 1;
  display: flex;
  align-items: center;
  transition: opacity .2s;

  &.is-center{
    justify-content: center;
  }

  & .el-alert__description {
    font-size: $--alert-description-font-size;
    margin: 5px 0 0 0;
  }
}

.el-alert--success {
  background-color: $--alert-success-color;
  color: $--color-success;

  .el-alert__description {
    color: $--color-success;
  }
}

.el-alert-info {
  background-color: $--alert-info-color;
  color: $--color-info;

  .el-alert__description {
    color: $--color-info;
  }
}

.el-alert--warning {
  background-color: $--alert-warning-color;
  color: $--color-warning;

  .el-alert__description {
    color: $--color-warning;
  }
}

.el-alert--error {
  background-color: $--alert-danger-color;
  color: $--color-danger;

  .el-alert__description {
    color: $--color-danger;
  }
}

.el-alert__content {
  display: table-cell;
  padding: 0 8px;
}

.el-alert__icon {
  font-size: $--alert-icon-size;
  width: $--alert-icon-size;
  &.is-big {
    font-size: $--alert-icon-large-size;
    width: $--alert-icon-large-size;
  }
}

.el-alert__title {
  font-size: $--alert-title-font-size;
  line-height: 18px;
  &.is-bold {
    font-weight: bold;
  }
}

.el-alert__closebtn {
  font-size: $--alert-close-font-size;
  color: $--color-text-placeholder;
  opacity: 1;
  position: absolute;
  top: 12px;
  right: 15px;
  cursor: pointer;

  &.is-customed {
    font-style: normal;
    font-size: $--alert-close-customed-font-size;
    top: 9px;
  }
}

.el-alert-fade-enter,
.el-alert-fade-leave-active {
  opacity: 0;
}

```