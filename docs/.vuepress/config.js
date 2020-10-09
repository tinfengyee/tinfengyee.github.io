module.exports = ctx => ({
  base: '/',
  title: 'Tinf - 天枫前端',
  description: 'Just playing around',
  dest: 'dist',
  smoothScroll: true,
  evergreen: true,
  markdown: {
    lineNumbers: false
  },
  themeConfig: {
    logo: '/logo.jpg',
    lastUpdated: 'Last Updated', // string | boolean
    navbar: true,
    nav: [
      { text: 'Article', link: '/article/' },
      { text: 'Interview', link: '/interview/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Recommend', link: '/recommend/' },
      {
        text: 'Contact',
        items: [
          { text: 'Github', link: 'https://github.com/tinfengyee' },
          { text: 'bilibili', link: 'https://space.bilibili.com/12445328' },
          { text: '微博', link: 'https://weibo.com/tinfengyee' },

        ]
      },
      
    ],
    sidebarDepth: 2,
    sidebar: {
      '/interview/': [
        '',
        {
          title: 'javascript',
          children: [
            'javascript/new模拟实现',
            'javascript/理解闭包和闭包的作用',
            'javascript/js手写代码',
            'javascript/let和const与var变量声明',
          ]
        },
        {
          title: 'vue',
          children: [
            'vue/vue'
          ]
        },
        {
          title: 'h5c3',
          children: [
            'h5c3/h5c3'
          ]
        }
      ],
      '/article/': [
        '',
        {
          title: 'javascript',
          children: [
            'javascript/javascript',
            'javascript/webapi',
          ]
        },
        {
          title: 'vue',
          children: [
            'vue/vue'
          ]
        }
      ],
      '/guide/': [
        ''
      ],
      '/recommend/': [
        ''
      ],
    }
  },
  configureWebpack: (config, isServer) => {}
})


