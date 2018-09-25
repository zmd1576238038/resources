/*
 * @Description: 列表容器组件，适用于除文章列表之外的所有列表，用于外层包裹
 * @Author: LiuZhen
 * @Date: 2018-06-01 16:39:49
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-27 14:53:32
 */
<template>
  <section class="list-container">
    <el-tabs v-model="activeTabName">
      <el-tab-pane :label="activeTabName" :name="activeTabName">
        <slot></slot>
      </el-tab-pane>
    </el-tabs>
    <div class="show-more" v-if="showMore">
      <nuxt-link :to="moreInfoUrl">{{moreInfoTitle}}<svg-icon iconClass="left_arrow" class="icon-arrow"></svg-icon></nuxt-link>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'

export default {
  name: 'ListContainer',
  data () {
    return {
    }
  },

  props: {
    activeTabName: {
      type: String,
      default: '',
      required: true
    },
    showMore: {
      type: Boolean,
      default: false
    },
    moreInfoTitle: {
      type: String,
      default: '更多'
    },
    moreInfoUrl: {
      type: String,
      default: '/#'
    },
  },

  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.list-container
  margin-bottom 30px
  position relative
  .show-more
    display inline-block
    position absolute
    top 13px
    right 0
    height auto
    font-size 12px
    color #747474
    .icon-arrow
      width 12px
      height 12px
      position relative
      top 1.5px
      transform scaleX(-1)
  .el-tabs__nav-wrap::after
    z-index 0
</style>
