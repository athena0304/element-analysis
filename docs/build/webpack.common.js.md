# webpack.common.js

这个文件是在 `npm run dist` 的时候用到的

```
"dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme",
```

目的是把src下面的文件都进行构建打包， 输入为 `./src/index.js`，输出为 `./lib`

所有的配置，在webpack官网都能找到对应的解释，我截取了一部分方便查看。想要看详细内容，可以点[这里](https://www.webpackjs.com/configuration/)。

```js
const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); // 导入非 webpack 自带默认插件

const config = require('./config');

module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.resolve(process.cwd(), './lib'), // output 目录对应一个绝对路径。
    publicPath: '/dist/', // 此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」。
    filename: 'element-ui.common.js', // 输出 bundle 的名称
    chunkFilename: '[id].js', //     chunkFilename: '[id].js', 此选项决定了非入口(non-entry) chunk 文件的名称。
    libraryTarget: 'commonjs2' // exported with module.exports
  },
  resolve: {
    // 这些选项能设置模块如何被解析。webpack 提供合理的默认值，但是还是可能会修改一些解析的细节。
    extensions: ['.js', '.vue', '.json'], // 自动解析确定的扩展。
    alias: config.alias, // 创建 import 或 require 的别名，来确保模块引入变得更简单。
    modules: ['node_modules'] // 告诉 webpack 解析模块时应该搜索的目录。
  },
  externals: config.externals,
  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们
  module: {
    // 关于模块配置
    rules: [
    // 模块规则（配置 loader、解析器等选项）
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
        // test 和 include 具有相同的作用，都是必须匹配选项
        // exclude 是必不匹配选项（优先于 test 和 include）
        // 最佳实践：
        // - 只在 test 和 文件名匹配 中使用正则表达式
        // - 在 include 和 exclude 中使用绝对路径数组
        // - 尽量避免 exclude，更倾向于使用 include
        loader: 'babel-loader'
        // 应该应用的 loader，它相对上下文解析
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
        // loader 的可选项
          preserveWhitespace: false
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      },
      {
        test: /\.otf|ttf|woff2?|eot(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
       // 把环境变量改成了 production
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
};

```

