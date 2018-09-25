/*
 * @Description: 评论组件
 * @Author: LiuZhen
 * @Date: 2018-06-08 10:12:34
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-21 11:06:58
 */
<template>
  <section class="comment">
    <section class="comment-submit">
      <header>
        <span class="blue-line"></span>
        <span class="name">最新评论</span>
        <span class="right" v-if = "comment.totalNumber > 0">{{comment.totalNumber}}条评论</span>
      </header>
    </section>
    <section class="comment-list-container">
      <ul v-if = "comment.totalNumber > 0">
        <li v-for="(item, index) in comment.data" :key="index">
          <div :class="['user-avatar', {vip: !!item.vipTag, real: !item.vipTag && !!item.realAuthedTag}]">
              <img :src="handleImgAddress(item.avatar, true)" alt="">
          </div>
          <div class="user-comment-content">
            <p>
              <span>{{item.userName}}</span>
              <span>{{item.commentDate}}</span>
            </p>
            <p><span v-show="identityTagFilte(item)">{{identityTagFilte(item)}}</span></p>
            <p>{{item.commentDesc}}</p>
          </div>
        </li>
      </ul>
      <div v-else class = "no-comment">
        暂时没有评论
      </div>
      <div class="article-btns" @click="gotoAPP">
        {{btnsName}}
      </div>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import { handleImgMixin,concatUrlMixin } from '@/utils/mixins'
import { mapState } from 'vuex'

export default {
  name: 'Comment',
  mixins: [handleImgMixin, concatUrlMixin],
  data () {
    return {
      textarea: '',
      isDisabled: true, // 评论是否可发布
      errorMessage: '', // 评论框验证错误提示

    }
  },
  props: {
    hasLogin: {},
    loadMore: {},
    comment: {}
  },
  computed: {
    ...mapState(['KGUser']),
    btnsName(){
      if(this.comment.totalNumber>0){
        return '打开千氪，查看全部评论'
      }else {
        return '进入客户端书写评论'
      }
    }
  },
  methods: {
    identityTagFilte(item) {
      if(!item.identityTag && item.realAuthedTag) return '已实名'
      return item.identityTag
    },
    // 发布评论
    gotoAPP () {
      this.$emit('openKgApp')
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.comment
  header
    font-size18px
    width 100%
    height 12vw
    line-height 12vw
    border-bottom $border
    position relative
    .blue-line
      display inline-block
      width 3px
      height 4.8vw
      background #1886fa
      margin-top 3.50vw
    .name
      display inline-block
      margin-left 4vw
      line-height 10vw
      position absolute
      top 2px
      left 0px
    .right
      display inline-block
      float right
      font-size 12px
      color #999999
      line-height 11vw
      margin-right 18px
  .comment-submit
    width 100%
    margin-bottom 20px
    .error
      margin-top 10px
      color #FC5A5D
      font-size 12px
    .no-login
      background #E9E9E9
      width 100%
      height 136px
      line-height 136px
      text-align center
      color #747474
      font-size 14px
      .text
        color #2382EA
        .to-login
          color #2382EA
          cursor pointer
          margin-left 5px
          &:hover
            text-decoration underline
        .to-register
          color #2382EA
          cursor pointer
          margin-right 5px
          &:hover
            text-decoration underline
    h4
      font-size 15px
      color #121212
      margin-bottom 15px
    p
      display flex
      margin-top 15px
      span
        flex 1
        font-size 13px
        color #747474
        &:last-child
          text-align right
        button
          width 68px
          height 28px
          line-height 3px
          border-radius 0
          font-size 13px
          background-color $color-text-active
          span
            color #fff
        .disabled
          cursor not-allowed
          background #e9e9e9
          border none
  .comment-list-container
    width 100%
    padding-bottom 100px
    0px
    ul
      li
        display flex
        margin-bottom 25px
        margin-left 12px
        .user-avatar
          position relative
          width 36px
          height 36px
          margin-right 12px
          img
            width 100%
            height 100%
            border-radius 50%
          &:after
            content ''
            position absolute
            bottom 0
            right 0
            width 10px
            height 10px
            background transparent
        .vip:after
          background url(../../assets/img/article/vip.png) no-repeat center/cover
        .real:after
          background url(../../assets/img/article/real.png) no-repeat center/cover
        .user-comment-content
          flex 1
          padding-bottom 25px
          font-size 13px
          border-bottom 1px solid #E9E9E9
          p
            &:first-child
              margin-bottom 8px
              font-size 16px
              span
                &:last-child
                  display inline-block
                  font-size 12px
                  float right
                  color #999999
                  margin-right 12px
            &:nth-child(2)
              span
                font-size 12px
                background rgba(236,245,255,1);
                color #1886FA
                padding 4px 4px
                border-radius 8px
                margin 4px 0px
            &:nth-child(3)
              margin-top 20px
              color #666
              font-size 13px
              line-height 20px
              word-break break-all
              margin-right 10px
              text-align justify
    .article-btns
      background linear-gradient(124.8deg,rgba(115,193,253,1),rgba(48,132,246,1))
      font-size 16px
      color #fff
      margin 30px 35px 10px 35px
      text-align center
      border-radius 40px
      padding 14px 0
    .no-comment
      font-size 16px
      color #4d4d4d
      width 100%
      text-align center
      padding 30px 0
      margin 24px 0
</style>
