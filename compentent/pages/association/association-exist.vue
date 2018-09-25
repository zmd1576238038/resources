/*
 * @Description: 关联已有账号
 * @Author: LiuZhen
 * @Date: 2018-05-31 20:34:56
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-22 14:42:18
 */
<template>
  <section class="association-exist">
    <el-row>
      <el-col :span="12">
        <div class="login-left-container"></div>
      </el-col>
      <el-col :span="12">
        <div class="login-right-container">
          <h3 class="back-to-index">
            <nuxt-link to="/" class="back-btn">返回首页</nuxt-link>
          </h3>
          <login-container>
            <el-tabs v-model="activeTabName">
              <el-tab-pane label="关联已有账号" name="关联已有账号">
                <el-form ref="form" :model="form" :rules="rules">
                  <el-form-item label="" prop="phone">
                    <el-input v-model="form.phone" placeholder="手机号"></el-input>
                  </el-form-item>
                  <el-form-item label="" class="input-password" prop="userPassword">
                    <el-input type="password" v-model="form.userPassword" placeholder="密码"></el-input>
                    <nuxt-link to="/forgotpwd" class="forget-password-link">忘记密码?</nuxt-link>
                  </el-form-item>
                  <el-button :loading="loginLoading" @click="submitForm('form')" type="primary" round class="login-btn">登录</el-button>
                  <nuxt-link to="/association/association-exist-phone"><el-button round class="login-btn">短信快捷登录</el-button></nuxt-link>
                </el-form>
                <p class="has-account-info"><nuxt-link to="/association/association-new" class="register-link">关联新账号</nuxt-link></p>
              </el-tab-pane>
            </el-tabs>
          </login-container>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import LoginContainer from '@/components/Login/LoginContainer'
import Verification from '@/utils/verification'
import { getUrlQuery, handleRequestParams, aliBlock, sendMessage, handleWebStorage  } from '@/utils/utils'

export default {
  name: 'register',
  layout: 'login',
  data () {
    return {
      loginLoading:false,
      activeTabName: '关联已有账号',
      form: {
        phone: '',
        userPassword: '',
      },
      rules: {
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入手机号'));
              } else if (this.areaCodeShow === '86') {
                if (!Verification.validateChinaPhone(value)) {
                  callback(new Error('请输入正确的手机号码'));
                }else {
                  callback()
                }
              } else {
                if(!Verification.validatePhone(value)){
                  callback(new Error('请输入正确的手机号码'));
                }else {
                  callback()
                }
              }
            },
            trigger: 'blur'
          },
        ],
        userPassword:[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      areaCodeShow: '+86'
    }
  },

  components: {
    LoginContainer,
    SvgIcon
  },
  methods:{
    submitForm(formName) {
      const that = this
      let openId = localStorage.getItem('kg_third_openId');
      this.$refs[formName].validate((valid) => {
          if (valid) {
            const login_phonelist = {
                  "userMobile":this.form.phone,
                  "openId":openId,
                  "userPassword":this.form.userPassword,
                  "openType":localStorage.getItem('openType')
            }
            this.loginLoading = true;
               that.ajax({
                          url: '/thirdParty/bindLoginUser',
                          data: login_phonelist,
                          success:  (data) => {
                              if(data.code == 10000){
                                  data = data.responseBody.data;
                                  that.$store.dispatch('userLogin', data).then(() => {
                                  })
                                  that.$message({
                                    message: '关联成功',
                                    type: 'success'
                                  });
                                  const prevUrl = handleWebStorage.getLocalData('prevUrl', 'sessionStorage');
                                  setTimeout(()=>{
                                    that.loginLoading = false;
                                    window.location.href = prevUrl;
                                },1000);
                              }else{
                                  that.$message({
                                    message: data.message,
                                    type: 'error'
                                  });
                                  that.loginLoading = false
                              }
                    }
                })
          } else {
            return false;
          }
        });
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
div
  height 100%
.el-scrollbar,.el-select-dropdown,.el-dialog__body, .el-dialog__header,.el-message
  height auto
.association-exist
  width 100%
  height 100%
  position relative
  .login-left-container
    width 50%
    position absolute
    top 0
    left 0
    background-image url('../../assets/img/login/login-left-background-img.png')
    background-repeat no-repeat
    background-size 100% 100%
  .login-right-container
    background-color #3e4777
    width 50%
    position absolute
    top 0
    right 0
    .el-input__inner
      border-radius 0
    .back-to-index
      padding 0 35px
      text-align right
      margin-top 35px
      .back-btn
        display inline-block
        width 78px
        height 28px
        text-align center
        line-height 28px
        font-size 12px
        background transparent
        color #fff
        border 1px solid #fff
        border-radius 14px
        font-weight 300
    .el-tabs__item
      color #fff
      font-size $font-size-medium-x
    .el-tabs__header
      margin 0 0 30px 0
    .el-form-item
      margin-bottom 20px
    .input-password
      position relative
      .forget-password-link
        position absolute
        top 0
        right 12px
        font-size $font-size-small
        color $color-text-active
    .not-account-info
      text-align left
      font-size $font-size-small
      margin-top 15px
      .register-link
        display inline-block
        color $color-text-active
    .login-btn
      width 100%
      margin-top 14px
      margin-bottom 10px
      font-size $font-size-medium-x
    .el-button+.el-button
      margin-left 0
    .social-login-container
      margin-top 30px
      & p:first-child
        color #fff
        font-size 13px
        margin-bottom 22px
      & p:last-child
        margin-bottom 40px
        a
          &:not(:last-child)
            margin-right 40px
        .weibo-login, .weixin-login
          display inline-block
          width 36px
          height 36px
          border-radius 50%
          background-color $color-text-active
          line-height 45px
          .svg-icon
            width 22px
            height 22px
            color #3e4777
    .agree-agreement
      text-align left
      color #fff
      font-size $font-size-small
      a
        font-size $font-size-small
        color $color-text-active
    .has-account-info
      text-align left
      margin-top 20px
      margin-bottom 28px
      font-size $font-size-small
      color #fff
      a
        color $color-text-active
</style>
