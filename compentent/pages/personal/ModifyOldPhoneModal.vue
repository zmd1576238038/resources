/*
* @Description: 个人中心页
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <div>
    <el-dialog
      class="modifyModal"
      title="修改手机号"
      :visible="oldPhoneVisible"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :lock-scroll="false"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <p class='modify-warning'>验证码将会发送至你的旧手机号</p>
        <el-form-item label="">
          <el-input type="text" size="small" :placeholder="accountData.userMobile" :disabled="true"></el-input>
        </el-form-item>
        <!-- 滑块验证 -->
        <AliBlock blockId="old-phone" cseId="old-cseId" sigId="old-sigId" tokenId="old-tokenId" sceneId="old-sceneId"/>
        <el-form-item label="" class="code-item">
          <el-input v-model="ruleForm.code" type="text" size="small" placeholder="验证码" prop="code"></el-input>
          <span v-show="!sendMsgDisabled" class="code-btn" @click="sendCode">获取验证码</span>
          <span v-show="sendMsgDisabled" class="code-btn" @click="sendCode">重新发送（{{time}}）</span>
        </el-form-item>
        <div class="modal-foot-btn">
          <el-button type="primary" class="submit-btn" @click="nextStep">下一步</el-button>
          <el-button class="cancel-btn" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 下一步操作 -->
    <modify-new-phone :visible="newPhoneVisible" :slideInfo="slideInfo" :handleSlide="handleSlide"
                      :getAccountInfo="getAccountInfo" :accountDataHandle="accountDataHandle"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import axios from '@/plugins/axios'
  import ModifyNewPhone from './ModifyNewPhoneModal'
  import AliBlock from '@/components/AliBlock/AliBlock'
  import {handleRequestParams, aliBlock, sendMessage} from '@/utils/utils'
  import {mapState, mapActions, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        ruleForm: {
          'code': ''
        },
        rules: {},
        personInfo: {},
        radio: '',
        newPhoneVisible: false,
        time: 5,
        sendMsgDisabled: false,
        interval: null,
      }
    },
    props: {
      beforeClose: {},
      visible: {},
      oldVisible: {},
      accountData: {},
      slideInfo: {},
      handleSlide: {},
      getAccountInfo: {},
      accountDataHandle: {}
    },
    components: {
      ModifyNewPhone, AliBlock
    },
    mounted() {
      this.newPhoneVisible = false
    },
    computed: {
      ...mapState([
        'oldPhoneVisible',
        'KGUser'
      ])
    },
    methods: {
      ...mapMutations([
        'SET_OLDPHONE_VISIBLE',//设置老手机弹窗visible
        'SET_NEWPHONE_VISIBLE'
      ]),
      cancel() {
        this.SET_OLDPHONE_VISIBLE(false)
        this.handleSlide('', '', '', '')
      },
      save() {
      },
      selected() {
      },
      selectProvince() {
      },
      selectArea() {
      },
      selectCity() {
      },
      nextStep() {
        const that = this;
        const list = {
          "userMobile": this.accountData.mobIle,
          "code": this.ruleForm.code,
        }
        this.ajax({
          url: '/userkg/chckSmsEmailCode',
          data: list,
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            if (res.code == 10000) {
              that.SET_NEWPHONE_VISIBLE(true)

              setTimeout(function () {
                aliBlock(
                  '#new-phone',
                  that,
                  'new-cseId',
                  'new-sigId',
                  'new-tokenId',
                  'new-sceneId'
                )
                that.cancel()
              }, 200)
            } else {
              that.$message({
                message: res.message,
                type: 'error'
              });
            }
          }
        })
        // axios({url:'/userkg/chckSmsEmailCode',method:'post',headers:{token:that.KGUser.token},data:list})
        // .then((res) => {
        //     if(res.data.code == 10000){
        //           that.SET_NEWPHONE_VISIBLE(true)

        //           setTimeout(function(){
        //               aliBlock(
        //                 '#new-phone',
        //                 that,
        //                 'new-cseId',
        //                 'new-sigId',
        //                 'new-tokenId',
        //                 'new-sceneId'
        //               )
        //               that.cancel()
        //           },200)
        //     }else{
        //           that.$message({
        //               message: res.data.message,
        //               type: 'error'
        //           });
        //     }
        //   }
        // )
      },
      sendCode() {
        let list = {
          "verIfy": this.accountData.mobIle,
          "mobileArea": '86',
          "platform": '3',
          "session": this.slideInfo.session,
          "sig": this.slideInfo.sig,
          "token": this.slideInfo.nc_token,
          "scene": this.slideInfo.nc_scene,
        }

        sendMessage(true, 'ruleForm', list,
          '#old-phone',
          'old-cseId',
          'old-sigId',
          'old-tokenId',
          'old-sceneId',
          this)
      }
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'
  @import '../../assets/stylus/personalModal.styl'

  .modify-warning
    width 300px
    margin-left 26px
    margin-bottom 15px
</style>
