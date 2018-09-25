/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:57
 */
<template>
  <section>
    <header class = 'column-header'>
        <span>我的专栏</span>
    </header>
    <section class = 'column-main'>
      <section class = 'column-tit'>
        <span class = 'block'></span>
        <span>什么是千氪专栏？</span>
      </section>
      <p class = 'column-des'>千氪专栏是为内容创作者提供创作环境与读者分析的平台。申请千氪专栏，即可在千氪发表文章，收获粉丝和文章奖励，文章质量越高，收益越多。千氪专栏旨在链接千氪、传递价值，满足优质作者的创作需求。</p>
      <section class = 'column-tit'>
        <span class = 'block'></span>
        <span>千氪专栏能为你提供</span>
      </section>
      <div class = 'column-type-content'>
        <div class = 'column-type' v-for = '(item,index) in columnType' :key = "index" >
          <img :src = 'item.img' />
          <div>
            <p>{{item.tit}}</p>
            <p>{{item.text}}</p>
          </div>
        </div>
      </div>
      <div class = 'column-btm'>
        <p>快去拥有自己的千氪专栏吧</p>
        <el-button type="primary" @click.native="goAuthor">立即申请</el-button>
      </div>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { AUTHOR_URL } from '@/config/config'
export default {
  data () {
    return {
      columnType:[
        {'img':require('../../assets/img/personal/duzhe.png'),'tit':'几十万优质读者','text':'与你共同成长'},
        {'img':require('../../assets/img/personal/yue.png'),'tit':'丰厚的文章奖励','text':'阅读、分享等交互均能带来奖励'},
        {'img':require('../../assets/img/personal/good.png'),'tit':'官方推荐','text':'首页推荐，获得更多展示'},
        {'img':require('../../assets/img/personal/ping.png'),'tit':'与平台共享广告收益','text':'功能将于近期上线'},
      ]
    }
  },
  methods:{
    goAuthor(){
      window.open(AUTHOR_URL)
    }
  },
  components: {
    SvgIcon
  },
  computed: {

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
.column-header
  personal-main-header()
  span:nth-child(1)
      padding-bottom 15px
      border-bottom 2px solid $color-text-active
.column-main
  width 100%
  height 797px
  padding 60px 50px
  background #fff
  .column-tit
    font-size 24px
    color #333
    font-weight 100
    display flex
    margin-bottom 47px
    .block
      display inline-block
      width 10px
      height 10px
      margin-top 11px
      margin-right 17px
      background #1373db
      transform rotate(45deg)
  .column-des
    font-size 16px
    color #666
    margin-bottom 49px
    line-height 24px
.column-type-content
  .column-type
    display flex
    float left
    width 430px
    height 120px
    border $border
    margin-right 30px
    img
      height 60px
      margin 30px 60px 0px 52px
    div
      display inline-block
      margin-top 38px
      p:nth-child(1)
        font-size 18px
        color #333
        margin-bottom 12px
      p:nth-child(2)
        font-size 14px
        color #747474

  .column-type:nth-child(2),.column-type:nth-child(4)
    margin-right 0px
  .column-type:nth-child(3),.column-type:nth-child(4)
    margin-top 30px
    margin-bottom 30px
.column-btm
  width 100%
  height 147px
  text-align center
  border $border
  flex-colunm-center()
  .el-button--primary
    width 248px
    margin 0 auto
    margin-top 15px
    border-radius 20px
    background #2382EA
  p
    font-size 14px
    color #9b9b9b
</style>
