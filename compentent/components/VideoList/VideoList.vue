/*
 * @Description: 热门视频列表组件
 * @Author: LiuZhen
 * @Date: 2018-06-01 17:05:05
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-08 10:29:49
 */
<template>
  <ul class="vd-video-list">
    <li v-if="descLocal=='bottom'" v-for="(item,index) in hotVideoList" :key="index">
      <nuxt-link to="" class="list-main">
        <p class="item-pic">
          <img v-lazy="handleImgAddress(item.articleImage)" alt="item.articleTitle">
          <span class="icon-round"><svg-icon iconClass="play" class="icon-play"></svg-icon></span>
        </p>
        <div class="item-desc">
          <p>{{item.articleTitle}}</p>
          <p>
            <img v-lazy="handleImgAddress(item.articleImage)" alt="item.articleTitle"/>
            <span>{{item.articleTitle}}</span>
          </p>
        </div>
      </nuxt-link>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { mapState } from 'vuex'
import { handleStrOverflow, handleImgAddr } from '@/utils/utils'

export default {
  name: 'ListVideo',
  data () {
    return {
    }
  },

  props: {
    itemNum: {
      type: Number,
      default: 5
    },
    descLocal: {
      type: String,
      default: 'bottom'
    }
  },

  computed: {
    ...mapState([
      'hotVideoList'
    ])
  },

  methods: {
    handleImgAddress (imgAddr) {
      return handleImgAddr(imgAddr)
    },
  },

  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.vd-video-list
  width 100%
  padding 16px
  background-color #fff
  .list-main
    display flex
    flex-direction row
  li
    &:not(:last-child)
      border-bottom 1px solid #E6E6E6
      margin-bottom 20px
      padding-bottom 20px
    a
      display inline-block
      width 100%
      height 100%
      p.item-pic
        position relative
        width 167px
        height 111px
        margin-bottom 16px
        img
          width 100%
          height 100%
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
            position relative
            top 1px
            left 1px
      p.item-desc
        font-size 13px
        color #333
        line-height 22px
</style>
