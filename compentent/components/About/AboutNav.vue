/*
 * @Description: 关于我们导航栏
 * @Author: zhangchenle
 * @Date: 2018-06-15 22:20:12
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-15 16:24:25
 */
<template>
  <div class = 'aboutBanner'>
    <ul class = 'aboutTab'>
          <li :class ="['fl', {aboutliActive: index===0}]"><a href = '/aboutus'>关于我们</a></li>
          <li :class ="['fl', {aboutliActive: index===1}]"><a href = '/contactus'>联系我们</a></li>
          <li :class ="['fl', {aboutliActive: index===2}]"><a href = '/copyright'>版权申明</a></li>
          <li :class ="['fl', {aboutliActive: index===3}]"><a href = '/useragreement'>用户注册协议</a></li>
          <li :class ="['fl', {aboutliActive: index===4}]"><a href = '/columnagreement'>专栏申请协议</a></li>
          <li :class ="['fl', {aboutliActive: index===5}]"><a href = '/tutorial'>使用教程</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      require: true
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.aboutBanner
    height 280px
    width 100%
    background url(https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18041801/aboutbg.png) no-repeat 50% / cover
    position: relative
    padding-top 29px
    .aboutTab
      margin auto
      position absolute
      bottom 0
      left: 0
      right 0
      width 1104px
      height: 70px
      line-height 70px
      background rgba(0, 0, 0, .1)
      .fl
        float left
      .aboutliActive
        background #1d87ff!important
      li
        width 184px
        text-align center
        height 70px
        line-height 70px
        a
          color #fff
          font-size 16px
          width 100%
          height 100%
          display inline-block
        &:hover
          background #344551

</style>
