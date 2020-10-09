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
            'javascript/Javascript的this绑定解析',
            'javascript/深度解析call和apply原理、使用场景及实现',
            // 'javascript/深度解析bind原理、使用场景及模拟实现',
            // 'javascript/JavaScript深入之重新认识箭头函数的this',
            // 'javascript/javascript继承方案讲解',
            // 'javascript/new模拟实现',
            // 'javascript/理解闭包和闭包的作用',
            // 'javascript/js去重',
            // 'javascript/js手写代码',
            // 'javascript/let和const与var变量声明',
            // 'javascript/javascript构造函数、原型和原型链'
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


