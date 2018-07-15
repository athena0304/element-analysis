# 构建

在package.json中，scripts 有很多项，想要研究工程是怎样构建的，从这里入手比较好。

```json
  "scripts": {
    "bootstrap": "yarn || npm i",
    "build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js",
    "build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
    "build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
    "build:umd": "node build/bin/build-locale.js",
    "clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage",
    "deploy": "npm run deploy:build && gh-pages -d examples/element-ui --remote eleme && rimraf examples/element-ui",
    "deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME",
    "dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
    "dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js",
    "dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme",
    "i18n": "node build/bin/i18n.js",
    "lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet",
    "pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js && sh build/deploy-faas.sh",
    "test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ karma start test/unit/karma.conf.js --single-run",
    "test:watch": "npm run build:theme && karma start test/unit/karma.conf.js"
  }
```



- `bootstrap`

``` bash
yarn || npm i
```

安装依赖，现在都推荐优先使用yarn

- `build:file`

``` bash
node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js
```

生成所有的构建文件

- `build:theme`

``` bash
node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk
```

构建主题相关

- `build:utils`

``` bash
cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js
```

这句话的意思是：编译整个 `src` 目录并将其输出到 `lib` 目录。[查阅](https://www.babeljs.cn/docs/usage/cli/#%E7%BC%96%E8%AF%91%E7%9B%AE%E5%BD%95)

这里涉及到一个npm包  [cross-env](https://www.npmjs.com/package/cross-env)，可以解决跨平台设置NODE_ENV等环境变量的问题

`BABEL_ENV` 涉及到的是 [`Babel`](https://www.babeljs.cn/) 相关的环境变量，这里设成了 `utils`，所以我们需要去根目录下的 `.babelrc` 查找这个环境变量下都干了些啥：

```json
{
  "presets": [["es2015", { "loose": true }]],
  "plugins": ["transform-vue-jsx"],
  "env": {
    "utils": {
      "plugins": [
        ["module-resolver", {
          "root": ["element-ui"],
          "alias": {
            "element-ui/src": "element-ui/lib"
          }
        }]
      ]
    }
  }
}
```

这里看到了在 `utils` 环境下使用了一个插件叫  [`module-resolver`](https://www.npmjs.com/package/babel-plugin-module-resolver)，当使用Babel编译时可以设置路径别名。这里将根目录设置成了 `element-ui`，这样在引用文件的时候就可以写成这样了`import locale from 'element-ui/src/locale';`



- `build:umd`

```bash
node build/bin/build-locale.js
```

这个是把组件中所有的多语言都转换成当下环境的语言，可以去 `src/locale/lang` 中查看所有文件，主要是日期选择器里面的本地化和一些组件的默认加载状态的文字。



- `clean`

```bash
rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage
```

清除所有的构建的文件

涉及到 npm 包[`rimraf`](https://www.npmjs.com/package/rimraf) ，The [UNIX command](http://en.wikipedia.org/wiki/Rm_(Unix)) `rm -rf` for node



- `deploy`

```bash
npm run deploy:build && gh-pages -d examples/element-ui --remote eleme && rimraf examples/element-ui
```

部署 element 文档



- `dev`

```bash
npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js
```

搭建开发环境



- `dev:play`

```bash
npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js
```

与 `dev` 相比少了安装的步骤，以及后面的 `template.js`的构建，多了个 `PLAY_ENV=true`



- `dist`

```bash
npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme
```

打包生成最终的代码，这应该是最全的了，

- 先清理环境，
- 然后构建文件
- 然后代码检查
- 然后 webpack webpack.conf.js
- 然后 webpack webpack.common.js
- 然后 webpack webpack.component.js
- 然后构建 utils
- 然后构建多语言
- 然后构建主题



- `i18n`

```bash
node build/bin/i18n.js
```

国际化



- `lint`

```bash
eslint src/**/* test/**/* packages/**/* build/**/* --quiet
```

代码检查



- `pub`

```bash
npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js && sh build/deploy-faas.sh
```

发布



- `test`

```bash
npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ karma start test/unit/karma.conf.js --single-run
```

测试相关



- `test:watch`

```bash
npm run build:theme && karma start test/unit/karma.conf.js
```

测试相关