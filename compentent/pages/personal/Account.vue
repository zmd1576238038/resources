/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:57
 */
<template>
  <section>
    <el-tabs v-model = "activeTabName" @tab-click="handleClick">
      <el-tab-pane label = "基本资料" name = "0" ><base-info :baseInfo="baseInfo"/></el-tab-pane>
      <el-tab-pane label = "账户安全" name = "1" ><account-safe /></el-tab-pane>
    </el-tabs>
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import axios from '@/plugins/axios'
import BaseInfo from './BaseInfo'
import AccountSafe from './AccountSafe'
import { mapState, mapMutations } from 'vuex'
import { handleRequestParams, handleWebStorage } from '@/utils/utils'

export default {
  data () {
    return {
      activeTabName: '0',
      baseInfoVisible: 1,
      baseInfo:[]
    }
  },
  components: {
    BaseInfo,AccountSafe
  },
  computed: {
    ...mapState([
      'KGUser'
    ])
  },
  mounted(){
    if(handleWebStorage.getLocalData('approve_open') == 2 || handleWebStorage.getLocalData('trader_pwd') == 2 || handleWebStorage.getLocalData('isBind') == 2){
        this.activeTabName = '1'
    }
  },
  methods:{
          ...mapMutations([
            'SET_PERSONAL_BASEINFO' //设置 个人基本资料 state
          ]),
          handleClick(tab, event) {
              handleWebStorage.setLocalData('approve_open',1)
              handleWebStorage.setLocalData('trader_pwd',1)
              handleWebStorage.setLocalData('isBind',1)
          }

  }

}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../assets/stylus/index.styl'
.el-tabs__content
  background #fff
  min-height 618px
</style>
