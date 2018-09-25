/*
 * @Description: 联系我们
 * @Author: zhangchenle
 * @Date: 2018-06-15 22:20:12
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-24 18:20:45
 */
<template>
	<div id="app" class ='aboutContainer' >
    <about-nav :index="1"></about-nav>
    <div class ='aboutMain'>
      <div class ='aboutTit'>
        <i></i>
        <h1>联系方式</h1>
      </div>
      <p class ='aboutInfo'>市场、商务合作请联系邮箱 :support@kg.com</p>
      <p class ='aboutInfo'>用户反馈请联系邮箱 : service@kg.com</p>
    </div>
	</div>
</template>

<script>
import AboutNav from '@/components/About/AboutNav';

export default {
  components: { AboutNav },
  head:{
    title:'联系我们-千氪'
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

#app
  margin-bottom 60px
  .aboutMain
    margin-bottom 60px
    width: 1098px
    margin: 0 auto
    background: #fff
    min-height: 600px
    padding: 50px 66px 66px
    .aboutTit
      display flex
      flex-direction row
      margin-top 15px
      i
        display inline-block
        width 8px
        height 8px
        background-color rgba(29, 135, 255, 1)
        margin-top 15px
        margin-right 20px
      h1
        font-size 24px
        color #444
        width 914px
        line-height 36px
    .aboutInfo
      font-size 16px
      color #999
      margin-left 30px
      width 914px
      line-height 28px
      margin-top 15px
</style>
