/*
 * @Description: 专栏列表组件
 * @Author: LiuZhen
 * @Date: 2018-06-01 17:46:04
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-14 14:14:22
 */
<template>
  <ul class="list-column">
    <li v-for="(item,index) in hotSpecialColumn" :key="index">
      <nuxt-link :to="concatUrl( 'author',item.userId)">
        <div class="author-container">
          <div class="author-avatar"><img v-lazy="handleAvatarUrl(item.columnAvatar)" alt="item.columnName"></div>
          <div class="author-info">
            <p class="author-name">{{item.columnName}}</p>
            <p class="author-article-num">已投稿{{item.artsum}}篇文章</p>
          </div>
        </div>
        <div class="author-article-desc" v-for="(art,artIndex) in item.list" :key="artIndex" v-if="artIndex===0">{{art.articleTitle}}</div>
      </nuxt-link>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import { OSS_ADDRESS } from '@/config/config'
import { concatUrlMixin } from '@/utils/mixins'

export default {
  name: 'ListSpecialColumn',
  mixins: [concatUrlMixin],
  data () {
    return {
    }
  },

  props: {
    hotSpecialColumn: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    handleAvatarUrl (addr) {
      return OSS_ADDRESS + addr
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.list-column
  width 100%
  padding 16px
  background-color #fff
  li
    &:not(:last-child)
      padding-bottom 10px
      border-bottom 1px dashed #E6E6E6
      margin-bottom 10px
    a
      display inline-block
      width 100%
      height 100%
      font-size 14px
      padding 6px
      &:hover
        background-color #F0F2F5
      .author-container
        display flex
        margin-bottom 22px
        .author-avatar
          width 40px
          height 40px
          margin-right 12px
          img
            width 100%
            height 100%
            border-radius 50%
        .author-info
          flex 1
          height 40px
          line-height 1.5
          p.author-name
            font-size 14px
            color #333
          p.author-article-num
            font-size 12px
            color #666
      .author-article-desc
        font-size 14px
        color #333
        line-height 22px
        margin-bottom 10px
        no-wrap()
</style>
