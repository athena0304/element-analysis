module.exports = {
  title: 'Element源码分析',  // 设置网站标题
  description: '一行代码都不要放过',
  base: '/element-analysis/',// 设置站点根路径
  repo: 'https://github.com/athena0304/element-analysis', // 添加 github 链接
  themeConfig: {
    repo: 'git@github.com:athena0304/element-analysis.git',
    nav: [
      { text: '组件', link: '/packages/' },
      { text: 'src', link: '/src/' },
      { text: '工程化', link: '/build/' }
    ],
    sidebar: {
      '/packages/': [
        '',
        {
          title: '组件',
          collapsable: false,
          children: [
            ['alert', 'alert'],
            ['dropdown', 'dropdown'],
          ]
        },
        {
          title: '样式',
          collapsable: false,
          children: [
            'theme-chalk/src/mixins/mixins',
            'theme-chalk/src/alert',
            'theme-chalk/src/dropdown',
          ]
        }
      ],
      '/src/': [
        '',
        'aaa',
        'directives',
        'mixins/emitter',
        'mixins/migrating',
      ],
      '/build/': [
        '',
        'webpack.common.js',
        'webpack.component.js',
        'webpack.conf.js',
        'webpack.demo.js',
        'webpack.test.js',
        'bin/build-entry.js',
        'bin/new.js'
      ]
    }
  }
}