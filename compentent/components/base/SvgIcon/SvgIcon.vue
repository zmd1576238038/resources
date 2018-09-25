/*
 * @Description: SvgIcon组件，用于引用svg格式的图标组件
 * @Author: LiuZhen
 * @Date: 2018-05-25 14:06:51
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-05-30 09:26:58
 */

<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script type="text/ecmascript-6">
// 引入所有的svg文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../../../assets/img/svg-icons', false, /\.svg$/)
requireAll(req)

export default {
  name: 'svg-icon',

  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },

  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    },
    svgClass () {
      if (this.className) {
        return `svg-icon ${this.className}`
      }
      return `svg-icon`
    }
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.svg-icon
  width 20px
  height 20px
  fill currentColor
  overflow hidden
</style>
