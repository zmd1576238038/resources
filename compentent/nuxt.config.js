const path = require('path')
const svgoConfig = require('./config/svgo-config.json')
const ICON_PATH = 'assets/img/svg-icons'
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '千氪-专注区块链|股票期货|基金|人工智能AI的金融科技媒体服务平台',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
      { hid: 'description', name: 'description', content: '千氪财经（Kg.com），新兴金融科技媒体服务平台，提供7*24小时全天候金融财经科技资讯，包括区块链、人工智能AI、物联网、大数据、数字货币、股票、期货、基金、新金融、新经济、商业等行业及时权威的要闻推送，并为用户提供一站式金融投资和理财交流服务' },
      { hid: "keywords", name: 'keywords', content: "千氪,千氪财经,区块链,数字货币,金融,财经,外汇,期货,基金,股票,人工智能,AI,大数据,物联网" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {src:'/polyfill.js'},
      {src: 'https://hm.baidu.com/hm.js?****'},/*引入百度统计的js*/
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Router config
  *  路由中间件配置，可在此配置当路由变化时需要条用的中间件
  */
  router: {
    middleware: ['check-auth', 'check-device']
  },

  /**
   * 缓存配置
   */
  cache: process.env.__ENV === 'production' || process.env.__ENV === 'test' ? { max: 20, maxAge: 900000 } : false,

  /**
   *  全局CSS配置, 可引入全局的CSS配置，比如normalize.css 或 自定义的 main.css
   */
  css: [
    { src: 'assets/stylus/main.styl', lang: 'stylus' }
  ],

  /*
  ** Plugins
  */
  plugins: [
    { src: '~plugins/lazy-load', ssr: false },
    { src: '~plugins/element-ui', ssr: true },
    { src: '~plugins/video-player', ssr: false },
    { src: '~plugins/ga'}
  ],

  /*
  ** Build configuration
  */
  build: {
    /**
     *  可视化性能分析，若要查看打包后的性能分析，可通过 `nuxt build --analyze` 或 `nuxt build -a`
     *  来构建分析代码，结果可在 http://localhost:8888 查看
     */
    analyze: {
      analyzerMode: 'static'
    },
    /**
     *  第三方库打包，也可将自定义库加入
     */
    vendor: ['axios', 'element-ui', 'v-distpicker', 'vue-cropper'],

    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      /**
       *  获取Nuxt中默认的Webpack配置，并删除掉原有配置，加入exclude属性
       *  默认不处理svg，使用单独的配置处理svg
       */
      const rule = config.module.rules.find(r => r.test.toString() === '/\\.(png|jpe?g|gif|svg)$/')
      config.module.rules.splice(config.module.rules.indexOf(rule), 1)

      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        loader: 'url-loader',
        exclude: [ path.resolve(ICON_PATH) ],
        query: {
          limit: 1000, // 1KO
          name: 'img/[name].[hash:7].[ext]'
        }
      })

      config.module.rules.push({
        test: /\.svg$/,
        include: [ path.resolve(ICON_PATH) ],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]'
            }
          },
          {
            loader: 'svgo-loader',
            options: svgoConfig
          }
        ]
      })
    },

    /*
    ** Postcss配置
    */
    postcss: [
      require('postcss-nested')(),
      require('postcss-responsive-type')(),
      require('postcss-hexrgba')(),
      require('autoprefixer')({
        browsers: ['last 3 versions']
      })
    ]
  },

  env: {
    __ENV: process.env.__ENV
  },

  dev: (process.env.NODE_ENV !== 'production')
}
