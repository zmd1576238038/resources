/*
* @Description:  验证码弹窗
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <el-dialog
    class='code-modal'
    title="验证"
    :visible="visible"
    :before-close="cancel"
    :close-on-click-modal="false"
    :lock-scroll="false"
    center>
    <div class="ali-block">
      <div class="ln">
        <div :id="blockId"></div>
      </div>
      <input type="hidden" :id="cseId" :name="cseId"/>
      <input type="hidden" :id="sigId" :name="sigId"/>
      <input type="hidden" :id="tokenId" :name="tokenId"/>
      <input type="hidden" :id="sceneId" :name="sceneId"/>
    </div>
    <!-- <p>123123</p> -->
    <!-- <ali-block  :blockId="roll-out-id" :cseId="roll-out-cseIdId" :sigId="roll-out-sigId" :tokenId="roll-out-tokenId" :sceneId="roll-out-sceneId" /> -->
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  // import AliBlock from '@/compoents/AliBlock/AliBlock'

  export default {
    data() {
      return {}
    },
    props: {
      blockId: {},
      cseId: {},
      sigId: {},
      tokenId: {},
      sceneId: {},
      visible: {},
      cancel: {}
    },
    components: {
      // AliBlock
    },
    computed: {},
    methods: {
      beforeClose() {
      }
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'

  .ali-block
    width 300px
    margin 0 auto
    margin-bottom 16px
    position relative
    z-index 9999
    .nc-container .nc_scale .btn_slide, .nc-container .nc_scale .btn_ok
      height 100%

  .code-modal
    .el-dialog
      width 404px
      height 160px
</style>
