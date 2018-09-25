/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:10
 */
<template>
  <section >
    <header class = 'shift-header'>
        <span>转入钛值</span>
        <span class = 'out-detail' @click = 'shiftHandle'>转入明细</span>
    </header>
    <section class = 'shift-main'>
                <div>
                  <span>请将你的钛值转入此地址：</span>
                  <input id = "copyInput" v-model = 'txAddress'/>
                  <span class = 'copy' @click = 'copy'>复制</span>
                </div>
                <p class = 'warning'>注意：转账时请在备注框中填写：{{KGUser.userId}}，填错或不填，将无法到账！</p>
                <h3 class = 'explain'>转入说明:</h3>
                <p class = 'ex-p'>1、钛值（TV）转账需要整个钛值（TV）网络进行确认，因此每笔转账需预留至少0.01个钛值在原地址，达到30个确认后您的钛值（TV）会自动充值到您的账户中。</p>
                <p class = 'ex-p'>2、您在操作钛值钱包向此地址转账时，务必填上备注信息：{{KGUser.userId}},否则将无法到账。</p>
                <p class = 'ex-p'>3、此地址禁止充值除钛值（TV）以外的其他任何币种，否则丢失将无法找回，责任自负。</p>
                <p class = 'ex-p'><b>*</b>对转入钛值有疑问，您可以在线咨询客服，或拨打客服电话：{{serviceTel}}</p>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import axios from '@/plugins/axios'
import C from '@/utils/personal'
import { mapState, mapMutations} from 'vuex'
import { handleWebStorage } from '@/utils/utils'

export default {
  data () {
    return {
      txAddress:'',
    }
  },
  computed: {
    ...mapState([
      'KGUser',
      'serviceTel'
    ])
  },
  mounted(){
    const that = this;
    this.ajax({
                  url: '/accountFlow/TopupTimes',
                  data: '',
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (res) => {
                    if(res.code == 10000){
                         that.txAddress = res.responseBody.data.txAddress
                    }else{
                        that.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                  }
    })
    // axios({url:'/accountFlow/TopupTimes',method:'post',headers:{token:that.KGUser.token},data:''}).then(
    //     (res) => {
    //       that.txAddress = res.data.responseBody.data.txAddress
    //     }
    // )
  },
  methods: {
    ...mapMutations([
      'SET_MODULE_PICK'
    ]),
    shiftHandle(){
      handleWebStorage.setLocalData('shit_open',2)
      this.SET_MODULE_PICK('MyTreasure')
      C.redirect('#')
    },
    copy() {
        const value=document.getElementById("copyInput");
        value.select();
        document.execCommand("Copy");
        alert('复制成功')
    },
  },

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
.shift-header
    display flex
    flex-direction row
    justify-content space-between
    border-bottom 1px solid #E1E0E1
    font-size 14px
    color #666
    margin-bottom 20px
    span:nth-child(1)
      padding-bottom 15px
      border-bottom 2px solid $color-text-active
    span:nth-child(2)
      cursor pointer
.shift-main
  width 100%
  height 600px
  background #fff
  padding 30px
  font-size 14px
  color #333
  input
    width 690px
    height 40px
    line-height 40px
    border 1px solid #ebebeb
    outline none
    padding-left 14px
    margin-right 30px
  .copy
    color $color-text-active
    cursor pointer
  .warning
    color $color-text-red
    font-size 12px
    margin-top 14px
    padding-bottom 19px
    border-bottom $border
  .explain
    font-size 14px
    color #333
    font-weight 100
    margin-bottom 16px
  .ex-p
    font-size 12px
    color #666
    margin-bottom 5px



</style>
