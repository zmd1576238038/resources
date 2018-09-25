/*
 * @Description: H5页面为你推荐组件
 * @Author: cb
 * @Date: 2018-06-19
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-21 16:28:00
 */
<template>
 <section class="h5-recommend-list">
    <header>
      <span class="blue-line"></span>
      <span>为您推荐</span>
    </header>
    <section class="lists">
      <section class="list" v-for="(item,index) in list" :key="index">
        <div class="left">
          <nuxt-link :to="concatUrl(isVideo ? 'h5Video' : 'h5Article', item.articleId)" target="_blank">
            <h1>{{item.articleTitle}}</h1>
          </nuxt-link>
          <p>
            <span class="name">{{userNameFilter(item)}}</span>
            <span>{{transformTime(item.updateTimestamp).slice(0,10)}}</span>
          </p>
        </div>
        <div class="right">
          <nuxt-link :to="concatUrl(isVideo ? 'h5Video' : 'h5Article', item.articleId)" target="_blank">
            <img v-lazy="handleImgAddress(item.articleImage)" alt="item.articleTitle"/>
            <span v-if="isVideo" class="play">
              <img v-lazy="playImg"/>
            </span>
          </nuxt-link>
        </div>
      </section>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { handleImgMixin, concatUrlMixin } from '@/utils/mixins'
import { formatMsgTime } from '@/utils/utils'

export default {
  name: 'Footer',
  data () {
    return {
      playImg:require('../../assets/img/H5/play.png'), //播放图标
    }
  },
  mixins: [handleImgMixin, concatUrlMixin],
  props: {
    //为你推荐列表数据
    list:{},
    //判断是否为视频
    isVideo:{
      type: Boolean,
      default: false
    }
  },

  computed: {

  },
  methods:{
    transformTime(time){
      return formatMsgTime(time)
    },
    userNameFilter(item) {

      return item.username!=null&& item.username.length> 8 ? item.username.slice(0,8) + '...' : item.username
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.h5-recommend-list
  header
    display flex
    font-size 4.8vw
    width 100%
    height 12vw
    line-height 12vw
    border-bottom $border
    .blue-line
      display inline-block
      width 3px
      height 4.8vw
      background #1886fa
      margin-top 3.46vw
      margin-right 4vw
.lists
  padding 0px 3.2vw
  .list
    width 100%
    border-bottom $border
    display flex
    flex-direction row
    justify-content space-between
    height 29.3vw
    padding-top 5.3vw
    .left
      display flex
      flex-direction column
      justify-content space-between
      width 58.6vw
      height 19.73vw
      .name
        margin-right 12px
      h1
        color #333
        font-size 4.2vw
        line-height 6.1vw
        no-wrap(2)
        width 100%
      p
        font-size 3.2vw
        color #999
        line-height 3.7vw
    .right
      width 29.6vw
      height 19.73vw
      position relative
      img
        width 100%
        height 100%
        border-radius 5px
      .play
        position absolute
        display inline-block
        width 8vw
        height 8vw
        border-radius 50%
        background rgba(255,255,255,0.8)
        top 0
        left 0
        bottom 0
        right 0
        margin auto
        img
          width 2.66vw
          height 4vw
          margin-top 1.86vw
          margin-left 2.76vw
  .list:last-child
    border 0px
</style>
