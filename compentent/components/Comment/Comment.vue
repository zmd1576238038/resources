/*
 * @Description: 评论组件
 * @Author: LiuZhen
 * @Date: 2018-06-08 10:12:34
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-27 14:23:49
 */
<template>
  <section class="comment">
    <section class="comment-submit">
      <p class="fabiao">发表评论</p>
      <div v-if="set === 1 && hasLogin">
        <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="textarea" ref="comment"></el-input>
      </div >
      <div v-if="set === 1 && !hasLogin" class="no-login">请先<span class="text"><a class="to-login" href="/login">登录</a>/<a class="to-register" href="/register">注册</a></span>后参与评论
      </div>
      <div class="close-comment" v-if="set !== 1">评论功能已关闭</div>
      <div class="error">{{errorMessage}}</div>
      <p>
        <span>已有{{comment.totalNumber}}条</span>
        <span v-show="set === 1"><el-button type="primary" @click.stop="submitComment" :class="{disabled: isDisabled}" :disabled="isDisabled">发布</el-button></span>
      </p>
    </section>
    <section class="comment-list-container">
      <ul>
        <li v-for="(item, index) in comment.data" :key="index">
          <div :class="['user-avatar', {vip: !!item.vipTag, real: !item.vipTag && !!item.realAuthedTag}]">
            <nuxt-link :to="item.identityTag ? concatUrl('author',item.userId) : concatUrl('normal',item.userId)" target="_blank">
              <img :src="handleImgAddress(item.avatar, true)" alt="">
            </nuxt-link>
          </div>
          <div class="user-comment-content">
            <p>
              <span>{{item.userName}}</span>
              <span v-show="identityTagFilte(item)">{{identityTagFilte(item)}}</span>
            </p>
            <p>{{commentTime(item.commentDateTimestamp)}}</p>
            <p class="comment-desc" v-html="item.commentDesc"></p>
          </div>
        </li>
      </ul>
      <div v-if="loadMore" class="load-all-container">
        <div class="placeholder"></div>
        <el-button class="load-more-btn" @click.stop="loadingMore">查看更多评论</el-button>
      </div>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import { handleImgMixin,concatUrlMixin } from '@/utils/mixins'
import { formatMsgTime } from '@/utils/utils'
import { mapState } from 'vuex'

export default {
  name: 'Comment',
  mixins: [handleImgMixin, concatUrlMixin],
  data () {
    return {
      textarea: '',
      isDisabled: true, // 评论是否可发布
      errorMessage: '' // 评论框验证错误提示
    }
  },
  props: {
    set: {},
    hasLogin: {},
    loadMore: {},
    comment: {}
  },
  created(){

  },
  computed: {
    ...mapState(['KGUser'])
  },
  methods: {
    commentTime(time){
      return formatMsgTime(time,1)
    },
    identityTagFilte(item) {
      if(!item.identityTag && item.realAuthedTag) return '已实名'
      return item.identityTag
    },
    loadingMore () {
      this.$emit('loadingMore')
    },
    // 发布评论
    submitComment () {
      if (!this.isDisabled) {
        const text = this.textarea.replace(/\n/g, '<br/>').replace(/\r/g,'<br/>');
        this.$emit('submitComment', {commentDesc:text})
      }
    },
    // 清空评论框
    clearComment(){
      this.textarea = ''
    },
    // 获取焦点，并将评论框居中
    getFocus(){
      this.$refs.comment.focus()
      let Rect = document.body.getBoundingClientRect()
      let Height = Rect.bottom - Rect.top // 浏览器视窗高度
      let Top = Rect.top // body元素的偏移量
      let rect = this.$refs.comment.$el.getBoundingClientRect()
      let width = rect.bottom - rect.top // 编辑框高度
      let offset = rect.top - (Height - width)/2 // 当前窗口移动到中心的偏移量
      let total = offset - Top // body元素整体偏移量
      document.body.scrollTop = total // Chrome
      document.documentElement.scrollTop = total // Firefox
      window.pageYOffset = total // Safari
    }
  },
  watch: {
    textarea (newValue, oldValue) {
      if (!this.hasLogin) {
        this.isDisabled = true
        return
      }
      if( newValue.trim() === '' ) {
        this.isDisabled = true
        this.errorMessage = ''
      } else if(newValue.length > 500){
         this.isDisabled = true
         this.errorMessage = "评论不能超出500个字符"
      } else {
        this.isDisabled = false
        this.errorMessage = ''
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.comment
  width 100%
  height auto
  background-color #fff
  .comment-submit
    width 100%
    margin-bottom 45px
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
    .close-comment
      background #E9E9E9
      width 100%
      height 136px
      line-height 136px
      text-align center
      color #747474
      font-size 14px
    .fabiao
      font-size 16px
      // color #121212
      margin-bottom 15px
      // font-weight 0 !important
    p
      margin-top 15px
      position relative
      >span
        font-size 13px
        color #747474
        &:last-child
          position absolute
          right 0
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
    ul
      li
        display flex
        margin-bottom 25px
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
          border-bottom 1px dashed #E9E9E9
          .comment-desc
            word-break break-all
            line-height 20px
          p
            &:first-child
              margin-bottom 8px
              span
                &:last-child
                  margin-left 8px
                  font-size 12px
                  background rgba(236, 245, 255, 1)
                  padding 2px 8px
                  color $color-text-active
                  border-radius 8px
            &:nth-child(2)
              font-size 12px
              color #9B9B9B
              margin-bottom 20px
    .load-all-container
        display flex
        .placeholder
          display inline-block
          width 36px
          height 36px
          margin-right 12px
        .load-more-btn
          flex 1
          color $color-text-active
          font-size 14px
          background-color #F5F5F5
          border none
          height 50px
          &:hover
            border none
</style>
