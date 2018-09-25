/*
 * @Description: 使用教程
 * @Author: zhangchenle
 * @Date: 2018-06-15 22:20:12
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-24 15:40:02
 */
<template>
	<div id="app" class ='aboutContainer' >
    <about-nav :index="5"></about-nav>
    <div class ='about_Main'>
      <div class ='leftBox'>
        <ul class="subMenu">
            <li>1.发布视频</li>
        </ul>
      </div>
      <div class ='rightBox'>
        <div class="mainBox">
          <div class="title">如何插入视频链接</div>
          <p class="course_text">您可以把优酷、爱奇艺、腾讯视频等网站的视频插入到内容中，支持手机观看。您只需要从视频网站复制一段代码，粘贴到视频链接的输入框中即可。如下图：</p>
          <div class="imgBox">
              <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/tutorial.png"/>
          </div>
          <div class="title2">
              那么各个网站如何复制代码呢，请看下面：
          </div>
          <p class="course_text"><span>优酷</span>的复制方法如下图:</p>
          <div class="imgBox2">
              <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18032702/20180327175337.png"/>
          </div>
          <p class="course_text"><span>爱奇艺</span>的复制方法如下图:</p>
          <div class="imgBox2">
              <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18032702/20180327175326.png"/>
          </div>
          <p class="course_text"><span>腾讯视频</span>的复制方法如下图:</p>
          <div class="imgBox2">
              <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18032702/20180327175346.png"/>
          </div>
          <p class="course_text color6">注意：如果您在以上三个网站中没有找到图示的代码，就说明您所观看的视频，还不支持移动端观看。此时您可以复制其中的html代码（即 &lt;embed ... 格式的代码 ），但是只支持电脑观看。</p>
          <p class="course_text fx color6">其他视频网站这里不再一一赘述，方法和上面三个网站相似。总之遵循一个原则，优先复制&lt;iframe...格式的代码，如果没有则复制 &lt;embed ...格式的代码。</p>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
import AboutNav from '@/components/About/AboutNav';

export default {
  components: { AboutNav },
  head:{
    title:'使用教程-千氪'
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
#app
  margin-bottom 20px
  .about_Main
    width 1098px
    margin 0 auto
    min-height 2470px
    padding 50px 66px 66px 66px
    position relative
    margin-top 20px
    padding-bottom 0
    .leftBox
      position: absolute
      left 0
      top 0
      width 174px
      height 500px
      background  #fff
      border-radius 4px
      .subMenu
        width 100%
        li
          width 100%
          // width 159px
          height 52px
          line-height 52px
          color #444444
          background #EBEDF0
          padding-left 15px
          font-family PingFangSC-Regular
          font-size 14px
          cursor pointer
    .rightBox
      position absolute
      left 194px
      top 0
      width 906px
      background #fff
      border-radius 4px
      text-align left
      .mainBox
        margin-left 41px
        margin-right 49px
        .title
          font-size 24px
          color #333
          font-family PingFangSC-Regular
          margin 32px 0
        .course_text
          color #999999
          font-size 16px
          font-family PingFangSC-Regular
          margin-top 27px
          line-height 24px
        span
          color #1D87FF
        .title2
          margin 28px 0 27px 0
          color #333
          font-size 18px
          font-family PingFangSC-Regular,'微软雅黑'
        .imgBox
          margin-top 20px
          img
            width 870px
            border-radius 4px
            max-width 100%
        .imgBox2
          margin-top 20px
          img
            width 100%
            border-radius 4px
        .fx
          padding-bottom 60px
        .color6
          color #666666!important
</style>
