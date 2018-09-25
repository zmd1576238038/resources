/*
 * @Description: 热门视频列表组件
 * @Author: LiuZhen
 * @Date: 2018-06-01 17:05:05
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-24 16:30:11
 */
<template>
  <ul class="list-video">
    <li :class="handleLiStyle" v-if="descLocal=='bottom'" v-for="(item,index) in hotVideoList" :key="index">
      <nuxt-link :to="concatUrl(isArticle ? 'article' : 'video', item.articleId)" target="_blank">
        <p class="item-pic">
          <img v-lazy="changeImg(item.articleImage)" alt="item.articleTitle">
          <span v-if="!isArticle" class="icon-round"><svg-icon iconClass="play" class="icon-play"></svg-icon></span>
        </p>
        <p class="item-desc">{{item.articleTitle}}</p>
      </nuxt-link>
    </li>
    <li :class="{'desc-right':descLocal=='right'}" v-if="descLocal=='right'" v-for="(item,index) in hotVideoList" :key="index">
      <section class="item-pic">
        <nuxt-link :to="concatUrl(isArticle ? 'article' : 'video', item.articleId)" target="_blank">
          <img v-lazy="changeImg(item.articleImage)" alt="item.articleTitle" />
          <span v-if="!isArticle" class="icon-round"><svg-icon iconClass="play" style="position:absolute;width: 14px;height: 14px;transform: translate(-50%,-50%);left: 50%;top: 50%" class="icon-play"></svg-icon></span>
        </nuxt-link>
      </section>
      <section class="item-desc">
        <p class="item-desc-text"><nuxt-link :to="concatUrl(isArticle ? 'article' : 'video', item.articleId)">{{item.articleTitle}}</nuxt-link></p>
      </section>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { handleStrOverflow } from '@/utils/utils'
import { handleImgMixin, concatUrlMixin } from '@/utils/mixins'
import { randomImg } from "@/utils/utils";

export default {
  name: 'ListVideo',
  mixins: [handleImgMixin, concatUrlMixin],
  data () {
    return {
    }
  },

  props: {
    // 是否是文章为您推荐列表
    isArticle: {
      type: Boolean,
      default: false
    },
    // 视频图片宽度
    imgWidth: {
      type: String,
      default: '268px'
    },
    // 视频图片高度
    imgHeight: {
      type: String,
      default: '177px'
    },
    // 显示条数设定
    itemNum: {
      type: Number,
      default: 5
    },
    // 描述的位置，可在底部 bottom或右侧 right
    descLocal: {
      type: String,
      default: 'bottom'
    },
    // 数据对象集合
    hotVideoList: {
      type: Array,
      default: () => []
    },
    // 显示模式，默认一行
    showType: {
      type: String,
      default: 'vertical'  // 横向平铺 landscape
    },
    // 是否显示底部横向间隔条
    showSpacer: {
      type: Boolean,
      default: true
    },
    // 横向平铺时的间隔，默认16px
    liInterval: {
      type: String,
      default: '16px'
    }
  },

  computed: {
    handleLiStyle () {
      return {
        'desc-bottom': this.descLocal === 'bottom',
        'landscape interval': this.showType === 'landscape',
        'spacer': this.showSpacer
      }
    }
  },

  created () {
    // 根据itemNUm参数决定显示多少条数据
    this.hotVideoList = this.hotVideoList.length > this.itemNum ? this.hotVideoList.slice(0, this.itemNum) : this.hotVideoList

    // 设置图片宽高
    this.$nextTick(() => {
      if (this.$refs.imgContainer) {
        let imgList = this.$refs.imgContainer
        imgList.map((item, index) => {
          item.style.width = this.imgWidth
          item.style.height = this.imgHeight
        })
      }
    })

  },

  methods: {
    changeImg(url,errUrl){
      return {
        src: this.handleImgAddress(url),
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

.list-video
  width 100%
  background-color #fff
  li.desc-bottom
    &.landscape
      float left
      width 268px
    &:not(:last-child)
      margin-bottom 20px
      padding-bottom 20px
    &:last-child
      margin-bottom 5px
      padding-bottom 1px
    &.spacer
      border-bottom 1px solid #E6E6E6
      &:last-child
        border-bottom none
    &.interval
      &:not(:nth-child(3n+3))
        margin-right 16px
    a
      display inline-block
      width 100%
      height 100%
      p.item-pic
        position relative
        width 268px
        height 177px
        margin-bottom 16px
        overflow hidden
        img
          width 100%
          height 100%
          transition: all 1s;
        .icon-round
          display inline-block
          width 34px
          height 34px
          line-height 34px
          text-align center
          background-color $color-text-active
          border-radius 50%
          position absolute
          top 50%
          left 50%
          transform translate(-50%, -50%)
          .icon-play
            width 14px
            height 14px
            color #fff
            position absolute
            transform translate(-50%,-50%)
            top 50%
            left 50%
      p.item-pic:hover img
          transform: scale(1.05)
          // transition: all 3s ease 0s
          // -webkit-transform: scale(1.3);
			  	// -webkit-transform: all 1s ease 0s;
      p.item-desc
        font-size 14px
        color #333
        line-height 22px
        width 90%
        no-wrap(2)
        &:hover
          color #2382ea
  li.desc-right
    display flex
    padding-bottom 20px
    &:not(:last-child)
      border-bottom 1px solid #E6E6E6
    &:not(:first-child)
      padding-top 20px
    .item-pic
      position relative
      width 167px
      height 111px
      margin-right 16px
      a
        display inline-block
        width 100%
        height 100%
      img
        width 100%
        height 100%
      span
        display inline-block
        width 34px
        height 34px
        background-color $color-text-active
        border-radius 50%
        text-align center
        line-height 40px
        color #fff
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
    .item-desc
      flex 1
      font-size 14px
      line-height 22px
      no-wrap(2)
      .item-desc-text
        margin-bottom 20px
        color #333
        overflow hidden
      .item-desc-author
        font-size 12px
        .item-desc-author-avatar
          display inline-block
          width 18px
          height 18px
          margin-right 10px
          vertical-align middle
          img
            width 100%
            height 100%
            border-radius 50%
        .item-desc-author-name
          color #666
</style>
