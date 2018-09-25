/*
* @Description: 忘记密码页面
* @Author: LiuZhen
* @Date: 2018-05-31 19:37:58
* @Last Modified by: cb
* @Last Modified time: 2018-06-22 14:53:23
*/
<template>
  <section class="forgot-pwd">
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
              <el-tab-pane label="忘记密码" name="忘记密码">
                <el-form ref="form" :model="form" :rules="rules">
                  <el-form-item label="" prop="phone">
                    <el-row>
                      <el-col :span="6" class="area-code">
                        <el-select v-model="areaCodeShow">
                          <el-option v-for="(item, key) in areaData" :key="'area' + key" :label="'+' + item.code"
                                     :value="item.code">
                            <span style="float: left; color: #8492a6; font-size: 13px">+{{item.code}}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.countryname }}</span>
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="18">
                        <el-input v-model="form.phone" placeholder="手机号"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" class="input-password" prop="verificationCode">
                    <el-input v-model="form.verificationCode" placeholder="验证码"></el-input>
                    <div v-show="!sendMsgDisabled" @click="sendCode('form')" class="forget-password-link">获取验证码</div>
                    <div v-show="sendMsgDisabled" class="forget-password-link">重新发送（{{time}}）</div>
                  </el-form-item>
                  <el-form-item label="" class="input-password" prop="password">
                    <el-input type="password" maxlength="20" v-model="form.password" placeholder="密码"></el-input>
                  </el-form-item>
                  <el-form-item label=""  class="input-password" prop="repeatpwd">
                    <el-input type="password" maxlength="20" v-model="form.repeatpwd" placeholder="确认密码"></el-input>
                  </el-form-item>
                  <el-button type="primary" round class="login-btn" @click="submit('form')">确认</el-button>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </login-container>
        </div>
      </el-col>
    </el-row>
    <ali-code :visible="codeVisible" :cancel="cancelCode" blockId="roll-out-id" cseId="roll-out-cseId"
              sigId="roll-out-sigId" tokenId="roll-out-tokenId" sceneId="roll-out-id-sceneId"/>
  </section>
</template>

<script type="text/ecmascript-6">
  import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
  import LoginContainer from '@/components/Login/LoginContainer'
  import {handleRequestParams, aliBlock, sendMessage} from '@/utils/utils'
  import AliCode from '@/components/AliCode/AliCode'
  import Verification from '@/utils/verification'
  import axios from '@/plugins/axios'
  import areaData from '@/config/phoneAreaCode'

  export default {
    head: {
      title: '找回密码',
      meta: [
        {hid: 'keywords', name: 'keywords', content: '找回密码'},
        {hid: 'description', name: 'description', content: '找回密码'}
      ],
      script: [
        {src: '//g.alicdn.com/sd/ncpc/nc.js?t=2015052012'}
      ],
      link: [
        {href: 'https://g.alicdn.com/sd/ncpc/nc.css?t=1517295462152'}
      ]
    },
    name: 'forgotpwd',
    layout: 'login',
    data() {
      const _this = this;
      return {
        areaData: areaData,
        activeTabName: '忘记密码',
        form: {
          phone: '',
          verificationCode: '',
          password: '',
          repeatpwd: ''
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
                  } else {
                    callback()
                  }
                } else {
                  if (!Verification.validatePhone(value)) {
                    callback(new Error('请输入正确的手机号码'));
                  } else {
                    callback()
                  }
                }
              },
              trigger: ['blur', 'change']
            },
          ],
          verificationCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
          ],
          password: [
            {
              required: true,
              validator:(rule,value,callback) => {
                if(value === ''){
                  callback(new Error('请输入密码'))
                }else if(value.length<6 || value.length>20){
                  callback(new Error('请输入6-20位密码'))
                }else {
                  callback()
                }
              },
              trigger: ['blur', 'change']
            }],
          repeatpwd: [
            {
              required: true,
              validator: (rule,value,callback) => {
                if(value === ''){
                  callback(new Error('请再次确认密码'))
                }else if(value !== _this.form.password){
                  callback(new Error('两次密码不相同'))
                }else {
                  callback()
                }
              },
              trigger: ['blur','change']
            }],
        },
        areaCodeShow: '86',
        codeVisible: false, // 是否显示滑块
        interval: null,
        time: 5,
        sendMsgDisabled: false,
        slideInfo: {
          'session': '',
          'sig': '',
          'nc_token': '',
          'nc_scene': ''
        }
      }
    },
    components: {
      LoginContainer,
      SvgIcon,
      AliCode
    },
    methods: {
      cancelCode() {
        this.codeVisible = false
      },
      sendCode(form) {
        this.$refs[form].validateField('phone', (error) => {
          if (error) {
            return false
          } else {
            this.codeVisible = true
            const that = this;
            setTimeout(function () {
              aliBlock("roll-out-id", that, "roll-out-cseId", "roll-out-sigId", "roll-out-tokenId", "roll-out-id-sceneId", that.countDown)
            }, 200)
          }
        })
      },
      countDown(id, csessionid, sig, token, scene) {
        const me = this
        const list = {
          "verIfy": this.form.phone,
          "mobileArea": this.areaCodeShow,
          "platform": '3',
          "session": this.slideInfo.session,
          "sig": this.slideInfo.sig,
          "token": this.slideInfo.nc_token,
          "scene": this.slideInfo.nc_scene,
        }
        this.codeVisible = false
        sendMessage(false, 'form', list, id, csessionid, sig, token, scene, me)
      },
      handleSlide(session, sig, nc_token, nc_scene) {
        this.slideInfo.session = session
        this.slideInfo.sig = sig
        this.slideInfo.nc_token = nc_token
        this.slideInfo.nc_scene = nc_scene
      },
      submit(form) {
        const that = this;
        this.$refs[form].validate((valid) => {
          if (valid) {
            const list = {
              verIfy: this.form.phone,
              code: this.form.verificationCode,
              userPassword: this.form.password,
              confirmPassword: this.form.repeatpwd
            };
            axios({url: '/userkg/chckCodePwd', method: 'post', data: list}).then(
              (res) => {
                if (res.data.code == 10000) {
                  that.$message({
                    message: '密码修改成功',
                    type: 'success'
                  });
                  setTimeout(() => {
                    this.$router.push('/login')
                  }, 1000)
                } else {
                  that.$message({
                    message: res.data.message,
                    type: 'error'
                  });
                }
              }
            )
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

  .el-select-dropdown, .el-message
    height auto

  .forgot-pwd
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
        margin-bottom 50px
</style>
