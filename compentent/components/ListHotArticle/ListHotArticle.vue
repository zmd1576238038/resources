/*
 * @Description: 热门文章列表组件
 * @Author: LiuZhen
 * @Date: 2018-06-01 20:09:40
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-27 13:59:38
 */
<template>
  <ul class="list-hot-article">
    <li v-for="(item,index) in limitedArticleList" :key="index">
      <div v-if="index===0" class="top-one">
        <a :href="item.publishKind===2?'/video/' + item.articleId:`/article/${item.articleId}`"  target="_blank">
          <img v-lazy="handleImgAddrHandle(item.articleImage)" alt="item.articleTitle">
          <p class="top-one-article-title"><span>{{item.articleTitle}}</span></p>
        </a>
        <svg-icon iconClass="top-tag" class="icon-top-tag"></svg-icon>
        <span class="text-top">TOP</span>
      </div>
      <div v-if="index>0&&index<10" class="top-two">
        <p class="article-title-container">
          <span class="article-title-num" :class="{'grey-num':index>2}">{{index+1}}.</span>
          <span class="article-title">
            <a :href="item.publishKind===2?'/video/' + item.articleId:`/article/${item.articleId}`"  target="_blank" >{{item.articleTitle}}</a>
          </span>
        </p>
      </div>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { OSS_ADDRESS } from '@/config/config'
import { handleImgAddr, randomImg } from '@/utils/utils'

export default {
  name: 'ListHotArticle',
  data () {
    return {
      limitedArticleList: []
    }
  },

  props: {
    limitNum: {
      type: Number,
      default: 10
    },
    hotArticleList: {
      type: Array,
      default: () => []
    }
  },

  created () {
    if (this.hotArticleList.length > this.limitNum) {
      this.limitedArticleList = this.hotArticleList.slice(0, this.limitNum)
    } else {
      this.limitedArticleList = this.hotArticleList
    }
  },

  methods: {
    handleAvatarUrl (addr) {
      return OSS_ADDRESS + addr
    },
    handleImgAddrHandle(url,errUrl){
      return {
        src: handleImgAddr(url),
        error: errUrl || randomImg()
      }
    },
  },

  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.list-hot-article
  width 100%
  height auto
  background-color #fff
  padding 16px
  li
    &:not(:first-child)
      // height 76px
      padding 20px 0
    &:not(:first-child)
      border-bottom 1px dashed #E6E6E6
    &:last-child
      border none
    .grey-num
      color #D4D2D2
    .top-one
      position relative
      width 268px
      height 177px
      margin-bottom 20px
      .text-top
        position absolute
        top 10px
        left 1px
        color #fff
        display inline-block
        transform rotate(-45deg)
        font-size 13px
      .icon-top-tag
        position absolute
        top -1px
        left -2px
        width 48px
        height 48px
        color #FC5A5D
      img
        width 100%
        height 100%
      p.top-one-article-title
        width 100%
        height 60px
        background:rgba(0,0,0,.3);
        position absolute
        left 0
        bottom 0
        color #fff
        font-size 16px
        no-wrap(2)
        word-break break-all
        span
          display inline-block
          width 234px
          margin 10px auto
          line-height 20px
          no-wrap()
    p.article-title-container
      display flex
      font-size 13px
      .article-title-num
        width 35px
        font-size $font-size-medium-x
        font-style italic
        position relative
        top 1px
        overflow hidden
      .article-title
        overflow visible
        float left
        width calc(100% - 40px)
        a
          display inline-block
          font-size 14px
          line-height 20px
          max-width 100%
          no-wrap(2)
          word-break break-all
          &:hover
            color $color-text-active
</style>
