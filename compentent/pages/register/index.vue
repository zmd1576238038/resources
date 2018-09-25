/*
 * @Description: 注册页面
 * @Author: LiuZhen
 * @Date: 2018-05-31 19:01:20
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-22 14:53:31
 */
<template>
  <section class="register">
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
              <el-tab-pane label="账号注册" name="账号注册">
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
                  <el-form-item label="" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="昵称"></el-input>
                  </el-form-item>
                  <el-form-item label="" class="input-password" prop="password">
                    <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
                  </el-form-item>
                  <el-form-item label="" class="input-password" prop="repeatpwd">
                    <el-input type="password" v-model="form.repeatpwd" placeholder="确认密码"></el-input>
                  </el-form-item>
                  <p class="agree-agreement">
                    <el-checkbox v-model="checked"></el-checkbox>
                    <span> 我同意并接受</span>
                    <nuxt-link to="/useragreement">千氪财经用户协议</nuxt-link>
                  </p>
                  <el-button type="primary" round class="login-btn" @click="submit('form')">立即注册</el-button>
                </el-form>
                <p class="has-account-info">已有账号?  <nuxt-link to="/login" class="register-link">立即登录</nuxt-link></p>
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
import { handleRequestParams, aliBlock, sendMessage, handleWebStorage } from '@/utils/utils'
import AliCode from '@/components/AliCode/AliCode'
import Verification from '@/utils/verification'
import { mapActions } from 'vuex'
import axios from '@/plugins/axios'
import areaData from '@/config/phoneAreaCode'

export default {
  head: {
    title: '注册',
    meta: [
        { hid: 'keywords', name: 'keywords', content: '注册' },
        { hid: 'description', name: 'description', content: '注册' }
    ],
    script: [
      {src: '//g.alicdn.com/sd/ncpc/nc.js?t=2015052012'}
    ],
    link:[
      {href:'https://g.alicdn.com/sd/ncpc/nc.css?t=1517295462152'}
    ]
  },
  name: 'register',
  layout: 'login',
  data () {
    return {
      areaData: areaData,
      activeTabName: '账号注册',
      form: {
        phone: '',
        verificationCode: '',
        nickname: '',
        password: '',
        repeatpwd: ''
      },
      rules:{
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
        nickname:[
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        password:[
          { required: true,message: '请输入密码', trigger: 'blur' }
        ],
         repeatpwd:[
          { required: true,message: '请输入密码', trigger: 'blur' }
        ],
      },
      areaCodeShow: '86',
      checked: false,
      codeVisible:false, // 是否显示滑块
      interval:null,
      time:5,
      sendMsgDisabled:false,
      slideInfo:{
        'session':'',
        'sig':'',
        'nc_token':'',
        'nc_scene':''
      }
    }
  },
  components: {
    LoginContainer,
    SvgIcon,
    AliCode
  },
  methods: {
    ...mapActions(['userLogin']),
    cancelCode(){
      this.codeVisible = false
    },
    sendCode(form){
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
    // 账号注册成功后直接登录
    login(data){
      let that = this
      axios({url:'/userkg/checkLogin', method:'post', data }).then((res) => {
        if(res.data.code == 10000){
          this.userLogin(res.data.responseBody.data)
          this.$router.push('/')
        }else{
          that.$message({
            message: res.data.message,
            type: 'error'
          });
        }
      })
    },
    submit(form){
      const that = this;
      const list = {
        mobileArea: this.areaCodeShow,
        userMobile: this.form.phone,
        userName: this.form.nickname,
        userPassword: this.form.password,
        confirmPassword: this.form.repeatpwd,
        code: this.form.verificationCode,
        call_method: 'adduser'
      };
      this.$refs[form].validate((valid) => {
        if (valid) {
          if(!that.checked) {
            that.$message({
              message: '请同意并接受千氪财经用户协议',
              type: 'error'
            });
            return
          }
          axios({url:'/userkg/adduser', method:'post', data:list}).then(
            (res) => {
              if(res.data.code == 10000){
                that.$message({
                  message: '注册成功',
                  type: 'success'
                });
                that.login({
                  userMobile: this.form.phone,
                  userPassword: this.form.password
                })
              }else{
                that.$message({
                  message: res.data.message,
                  type: 'error'
                });
              }
            }
          )
        }else{
            return false;
        }
      });
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
@import '../../assets/stylus/personalModal.styl'

div
  height 100%
.el-select-dropdown, .el-message
  height auto
.register
  width 100%
  height 100%
  position relative
  .el-dialog__body, .el-dialog__header
    height auto
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
    .area-code
      position relative
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
      margin-bottom 25px
    .input-password
      position relative
      .forget-password-link
        cursor pointer
        position absolute
        top 0
        right 12px
        font-size $font-size-small
        color $color-text-active
      .disabled-code
        color #9B9B9B
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
      font-size $font-size-medium-x
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
      text-align right
      margin-top 20px
      margin-bottom 28px
      font-size $font-size-small
      color #fff
      a
        color $color-text-active
</style>
