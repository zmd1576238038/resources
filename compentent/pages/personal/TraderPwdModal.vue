/*
* @Description: 个人中心页
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <el-dialog
    class='modifyModal'
    title="设置交易密码"
    :visible="visible"
    :close-on-click-modal="false"
    :lock-scroll="false"
    center>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="">
        <el-input type="text" size='small' :placeholder="accountData.userMobile" :disabled="true"></el-input>
      </el-form-item>
      <AliBlock blockId="traderpwd" cseId="traderpwd-cseId" sigId="traderpwd-sigId" tokenId="traderpwd-tokenId"
                sceneId="traderpwd-sceneId"/>
      <el-form-item label="" class='code-item' prop="code">
        <el-input type="text" v-model="ruleForm.code" size='small' placeholder="验证码"></el-input>
        <span v-show="!sendMsgDisabled" class="code-btn" @click="sendCode">获取验证码</span>
        <span v-show="sendMsgDisabled" class="code-btn">重新发送（{{time}}）</span>
      </el-form-item>
      <el-form-item label="" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" size='small' placeholder="请输入交易密码"></el-input>
      </el-form-item>
      <el-form-item label="" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" size='small' placeholder="请确认交易密码"></el-input>
      </el-form-item>
      <div class='modal-foot-btn'>
        <el-button type="primary" class='submit-btn' @click="submit('ruleForm')">确认</el-button>
        <el-button class='cancel-btn' @click="cancel('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import axios from '@/plugins/axios'
  import {handleRequestParams, aliBlock, sendMessage} from '@/utils/utils'
  import AliBlock from '@/components/AliBlock/AliBlock'
  import {mapState} from 'vuex'
  import V from '@/utils/verification'

  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value == '') {
          return callback(new Error('请输入交易密码'));
        } else if (!(V.validateTraderPwd(value))) {
          return callback(new Error('请正确输入交易密码(6位数字)'));
        } else {
          callback();
        }
      };
      let validateCheckPass = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入交易密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次密码不相同'));
        } else {
          callback();
        }
      };
      let validateCode = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入验证码'));
        } else if (value.length > 6) {
          callback(new Error('验证码长度不超过6位数'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          code: "",
        },
        rules: {
          code: [
            {validator: validateCode, trigger: ['blur', 'change']}
          ],
          pass: [
            {validator: validatePass, trigger: ['blur', 'change']}
          ],
          checkPass: [
            {validator: validateCheckPass, trigger: ['blur','change']}
          ],

        },
        sendMsgDisabled: false,
        time: 5,
        interval: null,
        areCode: "86",

      }
    },
    props: {
      accountData: {},
      visible: {},
      traderVisibleHandle: {},
      slideInfo: {},
      handleSlide: {},
      getAccountInfo: {}
    },
    components: {
      AliBlock
    },
    computed: {
      ...mapState([
        'KGUser'
      ])
    },
    methods: {
      cancel(formName) {
        this.traderVisibleHandle(false)
        this.$refs[formName].resetFields()
        this.handleSlide('', '', '', '')
      },
      sendCode() {
        const list = {
          "verIfy": this.accountData.mobIle,
          "mobileArea": this.areCode,
          "platform": '3',
          "session": this.slideInfo.session,
          "sig": this.slideInfo.sig,
          "token": this.slideInfo.nc_token,
          "scene": this.slideInfo.nc_scene,
        };
        const that = this;
        sendMessage(true, 'ruleForm', list,
          '#traderpwd',
          'traderpwd-cseId',
          'traderpwd-sigId',
          'traderpwd-tokenId',
          'traderpwd-sceneId',
          that)
      },
      submit(formName) {
        const that = this;
        const list = {
          "userId": this.KGUser.userId,
          "code": that.ruleForm.code,
          "password": that.ruleForm.pass,
        }
        // console.log('list',list)

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ajax({
              url: '/lynn/setTxPassword',
              data: list,
              headers: {
                token: that.KGUser.token
              },
              success: (res) => {
                if (res.code == 10000) {
                  that.cancel(formName)
                  that.getAccountInfo()
                  that.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                } else {
                  that.$message({
                    message: res.message,
                    type: 'error'
                  });
                }
              }
            })
            // axios({url:'/lynn/setTxPassword',method:'post',headers:{token:that.KGUser.token},data:list})
            // .then((res) => {
            //     if(res.data.code == 10000){
            //           that.cancel(formName)
            //           that.getAccountInfo()
            //           that.$message({
            //               message: '提交成功',
            //               type: 'success'
            //           });
            //     }else{
            //           that.$message({
            //               message: res.data.message,
            //               type: 'error'
            //           });
            //     }
            //   }
            // )
          } else {
            return false;
          }
        });
      }
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'
  @import '../../assets/stylus/personalModal.styl'
  // .el-dialog
  //   width 400px
  //   height 400px
  //   .el-dialog__header
  //     font-size 18px
  //     color #333
  //     border-bottom $border
  // .el-dialog__headerbtn .el-dialog__close
  //   display none
</style>
