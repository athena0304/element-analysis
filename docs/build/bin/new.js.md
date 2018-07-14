#  build/bin/new.js
#element/源码

加入我要新建一个组件，可以执行 `make new` 命令，例如：
``` 
make new dropdown-multi
```

这时环境会执行
```
node build/bin/new.js dropdown-multi
```

一共修改了这些文件
![](build:bin:new.js/610786AF-8CA0-4C8E-911E-AEF55A8E5649.png)

`packages/dropdown-multi/src`

```
<template>
  <div class="el-dropdown-multi"></div>
</template>

<script>
export default {
  name: 'ElDropdownMulti'
};
</script>
```

packages/theme-chalk/src/dropdown-multi.scss
```
@import "mixins/mixins";
@import "common/var";

@include b(dropdown-multi) {
}
```
所以我们来看一下new这个文件
