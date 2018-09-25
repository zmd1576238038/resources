/*
* @Description: 滑块验证
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <div class="ali-block">
    <div class="ln">
      <div :id="blockId"></div>
    </div>
    <input type="hidden" :id="cseId" :name="cseId"/>
    <input type="hidden" :id="sigId" :name="sigId"/>
    <input type="hidden" :id="tokenId" :name="tokenId"/>
    <input type="hidden" :id="sceneId" :name="sceneId"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    data() {
      return {}
    },
    props: {
      blockId: {},
      cseId: {},
      sigId: {},
      tokenId: {},
      sceneId: {}
    },
    components: {},
    computed: {},
    methods: {},

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'

  .ali-block
    width 300px
    margin 0 auto
    margin-bottom 16px
    margin-top 20px
    .nc-container .nc_scale .btn_slide, .nc-container .nc_scale .btn_ok
      height 100%

</style>
