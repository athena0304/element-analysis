module.exports = {
  title: 'Element源码分析',  // 设置网站标题
  base: '/element-analysis/',// 设置站点根路径
  repo: 'https://github.com/athena0304/element-analysis', // 添加 github 链接
  themeConfig: {
    nav: [
      { text: '总览', link: '/' },
      { text: '组件', link: '/packages/alert' },
      { text: '工程化', link: '/build/' },
      { text: 'src', link: '/src/' },
      { text: '样式', link: '/packages/theme-chalk/' },
    ],
    sidebar: {
      '/packages/': [
          '',
          ['alert', 'alert'],
          ['dropdown', 'dropdown']
        ],
      '/src/': [
          '',
          ['mixins/emitter', 'emitter'],
          ['mixins/migrating', 'migrating']
        ],
      '/build/': [
          '',
          ['bin/build-entry.js'],
          ['bin/new.js']
        ]
    }
  }
}