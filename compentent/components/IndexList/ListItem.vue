/*
 * @Description: 列表组件，依次展示列表数据
 * @Author: LiuZhen
 * @Date: 2018-05-29 19:23:30
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-27 15:05:40
 */
<template>
  <ul class="list-item-container">
    <li v-if="listItem.length>0" v-for="(item, index) in listItem" :key="index" :class="{'ad-style':item.itemType==='AD'}">
      <section class="list-item" v-if="!item.itemType">
        <div class="article-img-container">
          <nuxt-link :to="concatUrl(checkIsVideo(item) ? 'video' : 'article', item.articleId)" target="_blank">
            <p class="item-pic">
              <img v-lazy="changeImg(item.articleImage)" :alt="item.articleTitle">
              <span v-if="checkIsVideo(item)" class="icon-round"><svg-icon iconClass="play" class="icon-play"></svg-icon></span>
            </p>
          </nuxt-link>
        </div>
        <div class="article-content-container">
          <p class="article-title">
            <span v-if="getDisplayStatus(item.displayStatus) && showtags" class="article-title-tag">{{getDisplayStatus(item.displayStatus)}}</span>
            <span v-if="item.articleType && showtags" class="article-title-tag">优质</span>
            <span class="article-title-content">
              <nuxt-link :to="concatUrl(checkIsVideo(item) ? 'video' : 'article', item.articleId)" target="_blank">{{strOverflow(item.articleTitle)}}</nuxt-link>
            </span>
          </p>
          <p class="article-desc" :title="item.articleDescription">
            <!-- 改动 -->
            <span>
              <nuxt-link  :to="concatUrl(checkIsVideo(item) ? 'video' : 'article', item.articleId)" target="_blank">{{item.articleDescription}}</nuxt-link>
            </span>
          </p>
          <div class="article-info">
            <p class="article-info-author">
              <nuxt-link :to="concatUrl('author', item.createUser)" target="_blank">
                <em class="article-info-author-pic"><img v-lazy="changeImg(item.profileavatar?item.profileavatar:item.columnAvatar,'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/1805/photocopy23x.png',1)"></em>
              </nuxt-link>
              <nuxt-link :to="concatUrl('author', item.createUser)" target="_blank">
                <span class="article-info-author-name" style="display:inline-block">{{item.username}}</span>
              </nuxt-link>
            </p>
            <p class="article-info-time"><svg-icon iconClass="time" class="icon-time"></svg-icon>{{transformTime(item.updateTimestamp)}}</p>
            <p class="article-info-browsenum"><svg-icon iconClass="view" class="icon-view"></svg-icon>{{item.browseNum}}</p>
          </div>
        </div>
      </section>
      <section class="list-item-ad" v-if="item.itemType==='AD'" :class="{'article-ad':item.imageType===2}">
        <a :href="item.imageType===1?`/article/${item.imageDetail}`:item.imageDetail" target="_blank">
          <img v-lazy="changeImg(item.imageAddress)" alt="">
          <p class="item-title" v-if="item.imageType===1">{{item.articleTitle}}</p>
        </a>
      </section>
    </li>
    <li v-if="listItem.length<1" class="no-data">
      <img src="~/assets/img/personal/nodata.png" alt="empty">
      <p>暂无数据</p>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { handleStrOverflow, formatMsgTime, handleImgAddr, randomImg } from '@/utils/utils'
import { handleImgMixin, concatUrlMixin } from '@/utils/mixins'

export default {
  name: 'ListItem',
  mixins: [handleImgMixin, concatUrlMixin],
  data () {
    return {
      showtags:false
    }
  },

  props: {
    isColumn: {},
    isShipin: {
      type: Boolean,
      default: false
    },
    listItem: {
      type: Array,
      default: () => []
    }
  },
  mounted(){
    const fullname = this.$route.fullPath
    if(!fullname.startsWith('/author')){
      this.showtags = true
    }
  },
  methods: {
    //默认图改变
    changeImg(url,errUrl,type){
      return {
        src: handleImgAddr(url,type),
        error: errUrl || randomImg()
      }
    },
    checkIsVideo(item){
      if(this.isShipin) return true
      if(item.videoUrl) return true
      if(item.publishKind === 2) return true
      return false
    },
    getDisplayStatus (num) {
      if(num == 1) return ''
      if(num == 2) return '置顶'
      if(num == 3) return '推荐'
      return ''
    },
    strOverflow (str) {
      return handleStrOverflow(str)
    },
    transformTime(time){
      return formatMsgTime(time)
    },
  },
  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.list-item-container
  li
    background-color $color-background-d
    margin-bottom 16px
    padding 16px
    &.ad-style
      padding 0
    .list-item
      display flex
      .article-img-container
        display inline-block
        width 220px
        height 146px
        margin-right 16px
        p.item-pic
          position relative
          width 220px
          height 146px
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
              position: absolute
              transform: translate(-50%,-50%)
              top: 50%
              left: 50%
      p.item-pic:hover img
          transform: scale(1.05)
				  // transition: all 3s ease 0s
          // -webkit-transform: scale(1.3);
			  	// -webkit-transform: all 1s ease 0s;
      .article-content-container
        flex: 1
        position relative
        height auto
        overflow hidden
        .article-title
          font-size $font-size-large
          color #333
          font-weight bold
          margin-bottom 10px
          line-height 26px
          display flex
          align-items center
          .article-title-content
            display inline-block
            flex 1
            overflow hidden
            >a
              display: inherit
              width: 100%
              overflow: hidden
              white-space nowrap
              text-overflow: ellipsis
          .article-title-tag
            display inline-block
            width 34px
            height 18px
            text-align center
            line-height 18px
            background-color #FC5A5D
            color #fff
            margin-right 10px
            font-size 12px
            position relative
        .article-desc
          font-size $font-size-medium - 1
          color #666
          line-height 22px
          height 40px
          no-wrap()
        .article-info
          position absolute
          left 0
          bottom 0
          display flex
          width 100%
          font-size 12px
          color #9B9B9B
          height 26px
          line-height 26px
          p.article-info-author
            flex: 2
            no-wrap(1)
            .article-info-author-pic
              display inline-block
              width 26px
              height 26px
              border-radius 50%
              overflow hidden
              cursor pointer
              img
                width 100%
                height 100%
            .article-info-author-name
              display inline-block
              width 80px
              vertical-align top
              margin-left 6px
              cursor pointer
              overflow hidden
              word-wrap normal
              word-break: keep-all
              text-overflow: ellipsis
          p.article-info-time
            flex: 2
            .icon-time
              width 12px
              height 12px
              color #9B9B9B
              margin-right 2px
              position relative
              top 2px
          p.article-info-browsenum
            flex: 1
            text-align right
            .icon-view
              width 14px
              height 14px
              color #9B9B9B
              margin-right 2px
              position relative
              top 2px
    .list-item-ad
      width 628px
      height 180px
      position relative
      overflow hidden
      a
        display inline-block
        width 100%
        height 100%
        img
          width 100%
          height 100%
          transition: all 1s;
      .item-title
        position absolute
        bottom 0px
        font-size 14px
        color #fff
        padding 10px 10px 5px 10px
        width 100%
        box-sizing border-box
        line-height 20px
        background-image: linear-gradient(0deg,#000,transparent)
    .list-item-ad:hover img
      transform: scale(1.01)
    .article-ad
      &:after
        content ''
        display inline-block
        background-image url("../../assets/img/adv.png")
        width 36px
        height 21px
        position absolute
        bottom 0
        right 0
  .no-data
    text-align center
    img
      width 151px
      height 157px
      margin-bottom 30px
    p
      font-size 14px
      color #333
      padding-top 37px
      position relative
      &:before
        content ''
        display inline-block
        position absolute
        width 120px
        height 8px
        background:rgba(240,242,245,1)
        top 0
        transform translate(-50%,0)
        left 50%
        border-radius 50%
</style>
