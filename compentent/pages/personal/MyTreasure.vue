/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:10
 */
<template>
  <section>
    <el-tabs v-model = "activeTabName" @tab-click="handleClick">
      <el-tab-pane label = "我的钛值" name = "0" ><ti-value /></el-tab-pane>
      <el-tab-pane label = "氪金" name = "1" ><kg-value /></el-tab-pane>
    </el-tabs>
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import { handleRequestParams, handleWebStorage } from '@/utils/utils'
import axios from '@/plugins/axios'
import state from '@/store/state'
import TiValue from './TiValue'
import KgValue from './KgValue'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      activeTabName: '0'
    }
  },
  components: {
    TiValue,KgValue
  },
  computed: {
    ...mapState([
      'KGUser'
    ])
  },
  created(){
  },
  async fetch ({ store, params }) {
  },
  mounted(){

  },
  methods: {
    ...mapMutations([
      'SET_TVBALANCE', //设置 钛值数据 state
      'SET_TVLIST',  //设置 钛值流水 state
      'SET_KGBALANCE', //设置 氪金数据 state
      'SET_KGLIST',// 设置氪金流水 state
      'SET_TVMORE_VISIBLE',//设置钛值加载更多按钮 state
      'SET_KGMORE_VISIBLE',//设置氪金加载更多按钮 state
    ]),
    //切换币种类型
    async handleClick(tab, event){
      const that = this;
      if(tab.name === '0'){
         //获取钛值数据
         this.ajax({
                  url: '/account/selectByUserbalance',
                  data: {
                   userId: that.KGUser.userId
                  },
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (res) => {
                    if(res.code == 10000){
                        that.SET_TVBALANCE(res.responseBody.data)
                    }else{
                        that.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                  }
        })
        //  let tvBalance = await axios({url:'/account/selectByUserbalance',method:'post',headers:{token:that.KGUser.token},data:{userId: that.KGUser.userId}})
         //获取钛值流水
        this.ajax({
                  url: '/accountFlow/selectByUserflow',
                  data: {
                   userId: that.KGUser.userId,
                   currentPage:1
                  },
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (res) => {
                    if(res.code == 10000){
                        if(res.responseBody.currentPage >= res.responseBody.totalPage){
                          that.SET_TVMORE_VISIBLE(false)
                        }else{
                          that.SET_TVMORE_VISIBLE(true)
                        }
                        that.SET_TVLIST(res.responseBody.data)
                    }else{
                        that.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                  }
        })
        //  let tvList = await axios({url:'/accountFlow/selectByUserflow',method:'post',headers:{token:that.KGUser.token},data:{userId: that.KGUser.userId,currentPage:1}})
        //  this.SET_TVBALANCE(tvBalance.data.responseBody.data)
        //  this.SET_TVLIST(tvList.data.responseBody.data)
        //   if(tvList.data.responseBody.currentPage >= tvList.data.responseBody.totalPage){
        //     this.SET_TVMORE_VISIBLE(false)
        //   }else{
        //     this.SET_TVMORE_VISIBLE(true)
        //   }
      }else{
        //获取氪金数据
        this.ajax({
                  url: '/account/selectUserTxbBalance',
                  data: {
                   userId: that.KGUser.userId
                  },
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (res) => {
                    if(res.code == 10000){
                        that.SET_KGBALANCE(res.responseBody.data)
                    }else{
                        that.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                  }
        })
        //获取氪金流水
        this.ajax({
                  url: '/accountFlow/selectUserTxbflow',
                  data: {
                   userId: that.KGUser.userId,
                   currentPage:1
                  },
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (res) => {
                    if(res.code == 10000){
                        if(res.responseBody.currentPage >= res.responseBody.totalPage){
                          that.SET_KGMORE_VISIBLE(false)
                        }else{
                          that.SET_KGMORE_VISIBLE(true)
                        }
                        that.SET_KGLIST(res.responseBody.data)
                    }else{
                        that.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                  }
        })
       //获取氪金数据
      //  let kgBalance = await axios({url:'/account/selectUserTxbBalance',method:'post',headers:{token:that.KGUser.token},data:{userId: that.KGUser.userId}})
       //获取氪金流水
      //  let kgList = await axios({url:'/accountFlow/selectUserTxbflow',method:'post',headers:{token:that.KGUser.token},data:{userId: that.KGUser.userId,currentPage:1}})
        // if(kgList.data.responseBody.currentPage >= kgList.data.responseBody.totalPage){
        //    this.SET_KGMORE_VISIBLE(false)
        // }else{
        //    this.SET_KGMORE_VISIBLE(true)
        // }
      //  this.SET_KGBALANCE(kgBalance.data.responseBody.data)
      //  this.SET_KGLIST(kgList.data.responseBody.data)
      }
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
.el-tabs__item.is-active
  color #333
</style>
