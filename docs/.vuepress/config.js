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
            'javascript/let&const',
            'javascript/this',
            'javascript/arrow-function&this',
            'javascript/call&apply',
            'javascript/bind',
            'javascript/new',
            'javascript/constructor&prototype&prototype-chain',
            'javascript/inherit',
            'javascript/closure', // 1
            'javascript/closure-test',
            'javascript/memory&garbage-collection',
            'javascript/memory-leak',
            'javascript/constructor&prototype&prototype-chain',
            'javascript/scope-chain',
            'javascript/array-duplicate-removal',
            'javascript/common-test',
            'javascript/js-handwriting-code', // 2
            'javascript/array-duplicate-removal',
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


