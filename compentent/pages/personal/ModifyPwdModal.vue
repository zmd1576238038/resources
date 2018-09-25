/*
* @Description: 个人中心页
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <el-dialog
    class='modifyModal'
    title="修改密码"
    :visible="visible"
    :before-close="cancel"
    :close-on-click-modal="false"
    :lock-scroll="false"
    center>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="" prop="userPassword">
        <el-input type="password" maxlength="20" v-model="ruleForm.userPassword" size='small' class="martop20"
                  placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="" prop="newPwd">
        <el-input type="password" maxlength="20" v-model="ruleForm.newPwd" size='small' class="martop20"
                  placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="" prop="confirmPwd">
        <el-input type="password" maxlength="20" v-model="ruleForm.confirmPwd" size='small' class="martop20"
                  placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <div class='modal-foot-btn'>
        <el-button type="primary" class='submit-btn' @click="submit('ruleForm')">确认</el-button>
        <el-button class='cancel-btn' @click="cancel('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex'
  import reg from '@/utils/verification'
  export default {
    data() {
      let validateUserPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度6-20位，支持数字和英文字母'));
        } else if(!reg.validatePassWord(value)){
          callback(new Error('密码仅支持数字和英文字母'))
        }else {
          callback();
        }
      }
      let validateNewPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度6-20位，支持数字和英文字母'));
        } else {
          callback();
        }
      }
      let validateConfirm = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        } else if (value !== this.ruleForm.newPwd) {
          callback(new Error('两次密码不相同'));
        } else {
          callback();
        }
      }
      return {
        ruleForm: {
          userPassword: "",
          newPwd: "",
          confirmPwd: "",
        },
        rules: {
          userPassword: [{
            validator: validateUserPwd, trigger: 'blur'
          }],
          newPwd: [{
            validator: validateNewPwd, trigger: 'blur'
          }],
          confirmPwd: [{
            validator: validateConfirm, trigger: 'blur'
          }],
        },

      }
    },
    props: {
      visible: {},
      pwdVisibleHandle: {},
      accountData: {}
    },
    components: {},
    computed: {
      ...mapState([
        'KGUser'
      ])
    },
    methods: {
      submit(formName) {
        const that = this;
        const list = {
          "userId": this.KGUser.userId,
          "userPassword": this.ruleForm.userPassword,
          "newPwd": this.ruleForm.newPwd,
          "confirmPassword": this.ruleForm.confirmPwd,
          "userMobile": this.accountData.mobIle
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ajax({
              url: '/userkg/centerUpdatePd',
              data: list,
              headers: {
                token: that.KGUser.token
              },
              success: (res) => {
                if (res.code == 10000) {
                  that.cancel(formName)
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
            // axios({url:'/userkg/centerUpdatePd',method:'post',headers:{token:that.KGUser.token},data:list})
            // .then((res) => {
            //     if(res.data.code == 10000){
            //            that.cancel(formName)
            //            that.$message({
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
      },
      cancel(formName) {
        this.pwdVisibleHandle(false)
        this.$refs[formName].resetFields()
      }
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'
  @import '../../assets/stylus/personalModal.styl'
</style>
