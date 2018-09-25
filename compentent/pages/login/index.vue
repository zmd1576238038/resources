/*
* @Description: Login登录页
* @Author: LiuZhen
* @Date: 2018-05-31 11:28:13
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-27 15:02:01
*/
<template>
  <section class="login">
    <el-row>
      <el-col :span="12">
        <div class="login-left-container"></div>
      </el-col>
      <el-col :span="12">
        <div class="login-right-container" v-on:keyup.enter="submitLoginByEnter">
          <h3 class="back-to-index">
            <nuxt-link to="/" class="back-btn">返回首页</nuxt-link>
          </h3>
          <login-container>
            <el-tabs v-model="activeTabName">
              <el-tab-pane label="账号登录" name="账号登录">
                <!-- 账号登陆 -->
                <el-form ref="form1" :model="form1" :rules="rules1">
                  <el-form-item label="" prop="phone">
                    <el-input v-model="form1.phone" placeholder="手机号"></el-input>
                  </el-form-item>
                  <el-form-item label="" class="input-password" prop="userPassword">
                    <el-input type="password" maxlength="20" v-model="form1.userPassword" placeholder="密码"></el-input>
                    <nuxt-link to="/forgotpwd" class="forget-password-link">忘记密码?</nuxt-link>
                  </el-form-item>
                  <p class="not-account-info">还没有账户?
                    <nuxt-link to="/register" class="register-link">立即注册</nuxt-link>
                  </p>
                  <el-button type="primary" round class="login-btn" @click="handleUserLogin('form1')">立即登录</el-button>
                </el-form>
                <!-- 社交网络登陆 -->
                <div class="social-login-container" v-if="false">
                  <p>社交网络登录</p>
                  <p>
                    <span @click="loginWb" class="weibo-login">
                      <svg-icon iconClass="weibo" class="svg-icon"></svg-icon>
                    </span>
                    <span @click="loginWx" class="weixin-login">
                      <svg-icon iconClass="wechat" class="svg-icon"></svg-icon>
                    </span>
                  </p>
                </div>
              </el-tab-pane>
              <el-tab-pane label="短信登录" name="短信登录">
                <!-- 短信登陆 -->
                <el-form ref="form2" :model="form2" :rules="rules2">
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
                        <el-input v-model="form2.phone" placeholder="手机号"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" class="input-password" prop="verificationCode">
                    <el-input v-model="form2.verificationCode" placeholder="验证码"></el-input>
                    <div v-show="!sendMsgDisabled" @click="sendCode('form2')" class="forget-password-link">获取验证码</div>
                    <div v-show="sendMsgDisabled" class="forget-password-link">重新发送（{{time}}）</div>
                  </el-form-item>
                  <p class="not-account-info">还没有账户?
                    <nuxt-link to="/register" class="register-link">立即注册</nuxt-link>
                  </p>
                  <el-button type="primary" round class="login-btn" @click="handleUserLogin('form2')">立即登录</el-button>
                </el-form>
                <!-- 社交网络登陆 -->
                <div class="social-login-container" v-if="false">
                  <p>社交网络登录</p>
                  <p>
                    <span class="weibo-login">
                      <svg-icon iconClass="weibo" class="svg-icon"></svg-icon>
                    </span>
                    <span class="weixin-login">
                      <svg-icon iconClass="wechat" class="svg-icon"></svg-icon>
                    </span>
                  </p>
                </div>
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
  import axios from '@/plugins/axios'
  import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
  import LoginContainer from '@/components/Login/LoginContainer'
  import {handleRequestParams, aliBlock, sendMessage, handleWebStorage} from '@/utils/utils'
  import AliCode from '@/components/AliCode/AliCode'
  import {mapMutations} from 'vuex'
  import areaData from '@/config/phoneAreaCode'
  import Verification from '@/utils/verification'
  import C from '@/assets/js/config'
  import {weiboBind, wxBind} from '@/assets/js/common'

  export default {
    head: {
      title: '登录',
      meta: [
        {hid: 'keywords', name: 'keywords', content: '登录'},
        {hid: 'description', name: 'description', content: '登录'}
      ],
      script: [
        {src: '//g.alicdn.com/sd/ncpc/nc.js?t=2015052012'}
      ],
      link: [
        {href: 'https://g.alicdn.com/sd/ncpc/nc.css?t=1517295462152'}
      ]
    },
    name: 'login',
    layout: 'login',
    data() {
      return {
        areaData: areaData,
        activeTabName: '账号登录',
        form1: {
          phone: '',
          userPassword: ''
        },
        form2: {
          phone: '',
          verificationCode: ''
        },
        rules1: {
          phone: [
            {
              required: true,

              validator: (rule, value, callback) => {
                // let reg = 11 && /^[1][3,4,5,7,8][0-9]{9}$/,
                // if(this.form1.phone ==''){
                //     alert("请输入手机号码");
                // }else if(!reg.test(this.form1.phone)){
                //     alert("手机格式不正确");
                // }
                // var reg = 11 && /^[1][3,4,5,7,8][0-9]{9}$/;
                if (value === '') {
                  callback(new Error('请输入手机号'));
                } else if(value.length > 11){
                  callback(new Error('请输入正确的手机号码'));
                } else {
                  if (!Verification.validatePhone(value)) {
                    callback(new Error('请输入正确的手机号码'));
                  } else {
                    callback()
                  }
                }
              },
              trigger: ['blur','change']
            },
          ],
          userPassword: [{
            required: true,
            validator(rule, value, callback){
              // var reg = 11 && /^[1][3,4,5,7,8][0-9]{9}$/;
              if(!value){
                callback(new Error('请输入密码'))
              }else if(value.length<6 || value.length>20){
                callback(new Error('请输入6-20位密码'))
              }else {
                callback()
              }
            },
            trigger: ['blur', 'change']
          }],
        },
        rules2: {
          phone: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入手机号'));
                } else if(value.length > 11){
                  callback(new Error('手机号码长度为11位'));
                } else if (this.areaCodeShow === '86') {
                  if (!Verification.validateChinaPhone(value)) {
                    callback(new Error('请输入正确的手机号码'));
                  } else {
                    callback()
                  }
                }else {
                  if (!Verification.validatePhone(value)) {
                    callback(new Error('请输入正确的手机号码'));
                  } else {
                    callback()
                  }
                }
              },
              trigger: 'blur'
            },
          ],
          verificationCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
          ],
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
      ...mapMutations({
        setToken: 'SET_TOKEN'
      }),
      loginWb() {
        weiboBind()
      },
      loginWx() {
        wxBind()
      },
      cancelCode() {
        this.codeVisible = false
      },
      // sendCode(){
      //   let reg = 11 && /^[1][3,4,5,7,8][0-9]{9}$/;
      //   if(this.value.length ==''){
      //       alert("请输入手机号");
      //   }else if(!reg.test(this.phone)){
      //       alert("手机格式不正确");
      //   };
      // },
      sendCode(form) {
        let reg = 11 && /^[1][3,4,5,7,8][0-9]{9}$/;
        this.$refs[form].validateField('phone', (error) => {
          if (error) {
            return false
          } else if(!reg.test(this.phone)){
            callback(new Error('请输入正确的手机号码'));
          } else {
            this.codeVisible = true
            const that = this;
            setTimeout(function () {
              aliBlock("roll-out-id", that, "roll-out-cseId", "roll-out-sigId", "roll-out-tokenId", "roll-out-id-sceneId", that.countDown)
            }, 200)
          }
          //  else if(!reg.test(this.phone){
          //         callback(new Error('请输入正确的手机号码'));
          // }
        })
      },
      countDown(id, csessionid, sig, token, scene) {
        const me = this
        const list = {
          "verIfy": this.form2.phone,
          "mobileArea": this.areaCodeShow,

          "platform": '3',
          "session": this.slideInfo.session,
          "sig": this.slideInfo.sig,
          "token": this.slideInfo.nc_token,
          "scene": this.slideInfo.nc_scene,
        }
        sendMessage(false, 'form2', list, id, csessionid, sig, token, scene, me)
      },
      handleSlide(session, sig, nc_token, nc_scene) {
        this.slideInfo.session = session
        this.slideInfo.sig = sig
        this.slideInfo.nc_token = nc_token
        this.slideInfo.nc_scene = nc_scene
      },
      // 登录
      handleUserLogin(type) {
        this.$refs[type].validate(valid => {
          if (valid) {
            if (type === 'form1') {
              // 账号密码登录
              try {
                let data = {
                  userMobile: this.form1.phone,
                  userPassword: this.form1.userPassword
                }
                axios.post('/userkg/checkLogin', data).then(({data}) => {
                  if (data.code === '10000') {
                    const result = data.responseBody.data

                    // 向Vuex发起dispatch，调用userLogin方法将用户信息写入Vuex
                    this.$store.dispatch('userLogin', result).then(() => {
                      if(handleWebStorage.getLocalData('prevUrl','sessionStorage')){
                        this.$router.push(handleWebStorage.getLocalData('prevUrl', 'sessionStorage'))
                      }else {
                        this.$router.push('/')
                      }

                      // location.href = handleWebStorage.getLocalData('prevUrl', 'sessionStorage')
                    })
                  } else {
                    this.$message({
                      message: data.message,
                      type: 'error'
                    });
                  }
                })
              } catch (e) {
                throw new Error(e)
              }
            } else {
              // 短信验证码登录
              try {
                let data = {
                  userMobile: this.form2.phone,
                  code: this.form2.verificationCode
                }
                axios.post('/userkg/mobileLogin', data).then(({data}) => {
                  if (data.code === '10000') {
                    const result = data.responseBody.data
                    // 向Vuex发起dispatch，调用userLogin方法将用户信息写入Vuex
                    this.$store.dispatch('userLogin', result).then(() => {
                      if(handleWebStorage.getLocalData('prevUrl','sessionStorage')){
                        this.$router.push(handleWebStorage.getLocalData('prevUrl', 'sessionStorage'))
                      }else {
                        this.$router.push('/')
                      }
                    })
                  } else {
                    this.$message({
                      message: data.message,
                      type: 'error'
                    });
                  }
                })
              } catch (e) {
                throw new Error(e)
              }
            }
          } else {
            return false
          }
        });
      },

      // 响应键盘事件登录
      submitLoginByEnter() {
        const type = this.activeTabName === '账号登录' ? 'form1' : 'form2'
        this.handleUserLogin(type)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'
  @import '../../assets/stylus/personalModal.styl'
  .el-select-dropdown, .el-message
    height auto
  .login
    width 100%
    height 100%
    position relative
    div
      height 100%
      &.el-tabs__active-bar
        height 2px
    .el-dialog__body, .el-dialog__header
      height auto
    .ali-block
      height 32px
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
        background-color #2382EA
        &:hover
          background-color #2b8cf5
          border-color #2b8cf5
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
            margin 0px 20px
            cursor pointer
            .svg-icon
              width 22px
              height 22px
              color #3e4777
.el-button--primary
  border-color #2382ea
</style>
