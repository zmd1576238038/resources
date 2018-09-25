/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:57
 */
<template>
        <el-dialog
                class = 'account-detail-modal'
                title = "账单详情"
                :visible = "visible"
                :before-close = "beforeClose"
                :close-on-click-modal = "false"
                :lock-scroll = "false"
                center>
              <div class="detail-content">
                <p>流水号：<span>555</span></p>
                <p>类型：</p>
                <p>时间：</p>
                <p>事由：</p>
                <p>发放人：</p>
                <p>数量：</p>
              </div>
        </el-dialog>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import axios from '@/plugins/axios'

export default {
  data () {
    return {
    }
  },
  props:{
    cancelClose:{},
    visible:{}
  },
  components: {
  },
  computed: {
  },
  methods:{
    beforeClose(){
      this.cancelClose()
    }
  },

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
@import '../../assets/stylus/personalModal.styl'

.account-detail-modal
  .el-dialog
    width 400px
    .el-dialog__header
      border-bottom $border
.detail-content
  p
    margin-bottom 28px
    font-size 14
    color #333
    span
      color #666
</style>
