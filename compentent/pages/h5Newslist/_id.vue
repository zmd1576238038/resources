<template>
  <div class="newsShare">
    <div class="html-text" v-if="!canvasUrl">
      <div class="header-img">
        <img class="banner-img" src="../../assets/img/flashShareBanner.png" alt="header">
      </div>
      <div class="main-box">
        <div class="time">
          <img src="../../assets/img/blueTimerFlashNews.png" alt="time">
          <span>{{ date }}</span>
          <span>{{ time }}</span>
        </div>
        <div class="context">
          <p class="context-title">
            {{ title }}
          </p>
          <p class="context-main">
            {{ context }}
          </p>
        </div>
        <div class="footer-img">
          <img src="../../assets/img/flashNewsAppDown.png" alt="down">
        </div>
      </div>
    </div>
    <img class="canvas-url" v-if="canvasUrl" :src="canvasUrl">

  </div>
</template>
<script>
  import axios from '@/plugins/axios'
  import html2canvas from 'html2canvas'

  export default {
    head: {
      title: '快讯',
      meta: [
        {hid: 'keywords', name: 'keywords', content: '快讯'},
        {hid: 'description', name: 'description', content: '快讯'},
        {name: "viewport", content: "width=device-width,initial-scale=1,user-scalable=0"}
      ],
      script: [
        {src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'}
      ]
    },
    layout: 'login',
    data() {
      return {
        date: '',
        time: '',
        title: '',
        context: '',
        canvasUrl: ''
      }
    },
    async asyncData(route) {
      const id = route.params.id
      let {data} = await axios.post('/newsFlash/getNewsFlashDetail', {newsflashId: id})
      let result
      if (data && data.code === '10000') {
        result = data.responseBody.data[0]
      }
      if (result) {
        return {
          date: result.createDate && result.createDate.split(' ')[0],
          time: result.createDate && result.createDate.split(' ')[1],
          title: result.newsflashTitle,
          context: result.newsflashText,
        }
      }
    },
    mounted() {
      const _this = this
      setTimeout(() => {
        html2canvas(document.querySelector('.html-text')).then(canvas => {
          let url = canvas.toDataURL()
          _this.canvasUrl = url
        })
      }, 0)
    },
    methods: {
      getConfigSet() {
        const list = {
          url: window.location.href.split("#")[0]
        };
        const that = this
        this.ajax({
          url: '/weixin/weixinConfig',
          data: list,
          headers: {
            token: ''
          },
          success: (res) => {
            if (res.code === '10000') {
              res = res.responseBody;
              wx.config({
                debug: false,
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr,
                signature: res.signature,
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
              });
              setTimeout(() => {
                that.wxInit(res);
              }, 2000);
            } else {
              that.$message({
                message: res.message,
                type: 'error'
              });
            }
          }
        })
      },
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus">
  html
    font-size calc(100*100vw/750)
    width 100%
  body
    font-size 12px
    min-width 0
    background-color #fff
  .newsShare
    width 100%
    max-width 768px
    margin 0 auto
    overflow auto
    .header-img
      width 100%
      overflow hidden
      img
        width 100%
    .main-box
      padding 0 25px
      .time
        padding-top 20px
        padding-bottom 10px
        border-bottom 1px solid #e9e9e9
        position relative
        img
          width 18px
          height 18px
          margin-right 10px
          vertical-align middle
        span
          display inline-block
          height 100%
          font-size 18px
          color #333
          vertical-align middle
          &:last-child
            position absolute
            right 0
    .context
      padding-top 15px
      margin-bottom 35px
      overflow hidden
      .context-title
        font-size 18px
        color #333
        margin-bottom 15px
      .context-main
        font-size 16px
        color #333
        text-align justify
    .footer-img
      width 100%
      overflow hidden
      img
        width 100%
    .canvas-url
      width 100%
      padding-bottom 30px
</style>
