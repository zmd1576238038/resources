/*
 * @Description: 登陆、注册、找回密码等窗口容器组件
 * @Author: LiuZhen
 * @Date: 2018-05-31 14:55:54
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-16 13:52:36
 */
<template>
  <section class="login-container">
    <h3>
      <img src="../../assets/img/logo_white.png" alt="logo_white" class="logo">
      <!-- <svg-icon iconClass="logo" class="logo"></svg-icon> -->
    </h3>
    <slot></slot>
  </section>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'

export default {
  name: 'LoginContainer',
  data () {
    return {
    }
  },

  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.login-container
  width 398px
  height auto
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  background rgba(67, 76, 128, .48)
  padding 0 30px
  color #fff
  text-align center
  h3
    .logo
      width 105px
      height 38px
      color #fff
      margin-top 45px
      margin-bottom 64px
</style>
