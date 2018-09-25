/*
 * @Description: H5底部组件
 * @Author: cb
 * @Date: 2018-06-19
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-20 19:07:57
 */
<template>
 <section class="h5-footer">
   <span class="logo">千氪</span>
   <span class="center">APP注册 领取1888氪金</span>
   <span class="btn" @click="goApp">立即打开</span>
 </section>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { handleImgMixin, concatUrlMixin } from '@/utils/mixins'

export default {
  name: 'Footer',
  data () {
    return {
      footerImg:require('../../assets/img/H5/Oval 2@2x.png'), //播放图标
    }
  },
  mixins: [handleImgMixin, concatUrlMixin],
  props: {
    goApp:{},
  },

  computed: {

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.h5-footer
  width 100%
  height 13.86vw
  line-height 13.86vw
  background url('../../assets/img/H5/Oval 2@2x.png') no-repeat
  background-size contain
  color #fff
  display flex
  flex-direction row
  font-size 3.2vw
  padding 0px 5.33vw
  position fixed
  bottom 0px
  z-index 11
  .btn
    display inline-block
    color #1886FA
    background #fff
    border-radius 15px
    width 22.13vw
    height 8vw
    line-height 8vw
    text-align center
    font-size 3.2vw
    margin-top 2.93vw
  .center
    font-size 4.26vw
    margin 0px 5.06vw 0px 3.46vw
  .logo
    font-weight bold
    font-size 4.8vw
</style>
