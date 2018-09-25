/*
* @Description: 个人中心页
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <el-dialog
    class='warning-modal'
    title="提示"
    :visible="visible"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :lock-scroll="false"
    center>
    <div class="warning-content">
      <p>{{text}}</p>
      <div class='modal-foot-btn'>
        <el-button type="primary" class='submit-btn' @click="submit">{{reapprove ? '去认证' : '确认'}}</el-button>
        <el-button class='cancel-btn' @click="cancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import axios from '@/plugins/axios'

  export default {
    data() {
      return {}
    },
    props: {
      cancel: {},
      visible: {},
      text: {},
      submit: {},
      reapprove: {}
    },
    components: {},
    computed: {},
    methods: {
      beforeClose() {
        this.cancel()
      }
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'
  @import '../../assets/stylus/personalModal.styl'

  .warning-modal
    .el-dialog
      width 400px
      height 197px
    .el-dialog__header
      border-bottom $border
    p
      text-align center
      font-size 16px
      color #333
</style>
