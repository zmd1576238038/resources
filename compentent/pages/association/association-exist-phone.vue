/*
 * @Description: 关联已有账号,通过手机短信
 * @Author: LiuZhen
 * @Date: 2018-05-31 20:34:56
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-22 14:50:36
 */
<template>
  <section class="association-exist-phone">
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
                    <el-row>
                      <el-col :span="6" class="area-code">
                        <el-select v-model="areaCodeShow">
                          <el-option v-for="(item, key) in areaData" :key="'area' + key" :label="'+' + item.code" :value="item.code">
                            <span style="float: left; color: #8492a6; font-size: 13px">+{{item.code}}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.countryname }}</span>
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="18"><el-input v-model="form.phone" placeholder="手机号"></el-input></el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" class="input-password" prop="verificationCode">
                    <el-input v-model="form.verificationCode" placeholder="验证码"></el-input>
                    <div v-show="!sendMsgDisabled" @click="sendCode('form')" class="forget-password-link">获取验证码</div>
                    <div v-show="sendMsgDisabled" class="forget-password-link">重新发送（{{time}}）</div>
                  </el-form-item>
                  <el-button @click="submitForm('form')" type="primary" round class="login-btn">登录</el-button>
                  <nuxt-link to="/association/association-exist"><el-button round class="login-btn">账号密码登录</el-button></nuxt-link>
                </el-form>
                <p class="has-account-info"><nuxt-link to="/association/association-new" class="register-link">关联新账号</nuxt-link></p>
              </el-tab-pane>
            </el-tabs>
          </login-container>
        </div>
      </el-col>
    </el-row>
    <ali-code :visible="codeVisible" :cancel="cancelCode" blockId="roll-out-id" cseId="roll-out-cseId" sigId="roll-out-sigId" tokenId="roll-out-tokenId" sceneId="roll-out-id-sceneId" />
  </section>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import LoginContainer from '@/components/Login/LoginContainer'
import areaData from '@/config/phoneAreaCode'
import Verification from '@/utils/verification'
import AliCode from '@/components/AliCode/AliCode'
import { getUrlQuery, handleRequestParams, aliBlock, sendMessage, handleWebStorage  } from '@/utils/utils'

export default {
  name: 'register',
  layout: 'login',
  head: {
    title: '关联新账号',
    meta: [
        { hid: 'keywords', name: 'keywords', content: '关联新账号' },
        { hid: 'description', name: 'description', content: '关联新账号' }
    ],
    script: [
      {src: '//g.alicdn.com/sd/ncpc/nc.js?t=2015052012'}
    ],
    link:[
      {href:'https://g.alicdn.com/sd/ncpc/nc.css?t=1517295462152'}
    ]
  },
  data () {
    return {
      areaData: areaData, //手机国家代码
      activeTabName: '关联已有账号',
      form: {
        phone: '',
        verificationCode:''
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
        verificationCode:[
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      areaCodeShow: '+86',
      codeVisible:false, //滑块visible
      slideInfo:{
        'session':'',
        'sig':'',
        'nc_token':'',
        'nc_scene':''
      },  //滑块验证信息
      sendMsgDisabled:false,
      time:5,
    }
  },

  components: {
    LoginContainer,
    SvgIcon,
    AliCode
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
                  "code":this.form.verificationCode,
                  "openType":localStorage.getItem('openType')
            }
            this.loginLoading = true;
               that.ajax({
                          url: '/thirdParty/bindMobileLogin',
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
    },
    cancelCode(){
      this.codeVisible = false
    },
    sendCode(form){
      const that = this;
      this.$refs[form].validateField('phone', (error) => {
          if(error) {
            return false
          }else {
            this.codeVisible = true
            const that = this;
            setTimeout(function(){
              aliBlock("roll-out-id",that,"roll-out-cseId","roll-out-sigId","roll-out-tokenId","roll-out-id-sceneId",that.countDown)
            },200)
          }
      })
    },
    countDown(id,csessionid,sig,token,scene){
        const me = this
        const list = {
          "verIfy":this.form.phone,
          "mobileArea": this.areaCodeShow,
          "platform":'3',
          "session":this.slideInfo.session,
          "sig":this.slideInfo.sig,
          "token":this.slideInfo.nc_token,
          "scene":this.slideInfo.nc_scene,
        }
        sendMessage(false, 'form', list, id, csessionid, sig, token, scene, me)
    },
    handleSlide(session,sig,nc_token,nc_scene){
        this.slideInfo.session = session
        this.slideInfo.sig = sig
        this.slideInfo.nc_token = nc_token
        this.slideInfo.nc_scene = nc_scene
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

div
  height 100%
.el-scrollbar,.el-select-dropdown,.el-dialog__body, .el-dialog__header,.el-message
  height auto
.association-exist-phone
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
        cursor pointer
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
