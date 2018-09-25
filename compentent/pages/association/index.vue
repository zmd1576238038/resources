/*
 * @Description: 三方登录账号关联页面
 * @Author: LiuZhen
 * @Date: 2018-05-31 19:55:49
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-22 16:02:17
 */
<template>
  <section class="association">
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
            <div class="account-info">
              <p class="user-face">
                <span><img :src="handleImgAddrHandle(userInfo.headImgurl)" alt=""></span>
              </p>
              <p class="user-name">{{userInfo.nickName}}</p>
              <p class="tips-info">您尚未关联千氪账号</p>
            </div>
            <div class="association-btn">
              <p><nuxt-link to="/association/association-new"><el-button type="primary" round class="association-new-btn">关联新账号</el-button></nuxt-link></p>
              <p><nuxt-link to="/association/association-exist"><el-button round class="association-old-btn">关联已有账号</el-button></nuxt-link></p>
            </div>
          </login-container>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import LoginContainer from '@/components/Login/LoginContainer'
import { handleImgAddr, getUrlQuery, handleWebStorage } from '@/utils/utils'
import C from '@/assets/js/config'
import Common from '@/assets/js/common'

export default {
  name: 'register',
  layout: 'login',
  head: {
        title: '第三方登录',
        meta: [
            { hid: 'keywords', name: 'keywords', content: '第三方登录' },
            { hid: 'description', name: 'description', content: '第三方登录' },
        ],
        script: [
          {src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'}
        ]
  },
  data () {
    return {
      activeTabName: '忘记密码',
      form: {
        phoneNumber: '',
        verificationCode: '',
        password: '',
        repeatpwd: ''
      },
      areaCodeShow: '+86',
      userInfo:{}
    }
  },
  components: {
    LoginContainer,
    SvgIcon
  },
  methods:{
    handleImgAddrHandle(data,type){
       return handleImgAddr(data,1)
    },
  },
  mounted(){
    const prevUrl = handleWebStorage.getLocalData('prevUrl', 'sessionStorage');
    const that = this;
    const code = getUrlQuery('code');
    const openType = localStorage.getItem('openType');
    let bindOppId = localStorage.getItem('kg_third_openId');
    let bindData = JSON.parse(localStorage.getItem('kg_bind_data'));
    let bindData2 = JSON.parse(localStorage.getItem('bindData2'));
    let token = ''
    if (this.$store.state.KGUser) {
        token = this.$store.state.KGUser.token
    }
    if(bindOppId == null || bindOppId == ''){
      const thirdParty = {
                  "code":code,
                  "openType":openType,
                  'source':prevUrl.indexOf('personal') != '-1' ? '0' : '1'
      }
      that.ajax({
        url: '/thirdParty/checkThirdUserInfo',
        data: thirdParty,
        success: (data) => {
                if(data.code == 10000){
                                            data = data.responseBody.data;
                                            that.openId = data.openId
                                            if(prevUrl.indexOf('personal') != '-1'){
                                                  const bindWeibo = {
                                                        "openId":data.openId,
                                                        "userId":that.$store.state.KGUser.userId,
                                                        "openType":openType,
                                                  }
                                                 that.ajax({
                                                          url: '/thirdParty/bindUser',
                                                          data: bindWeibo,
                                                          headers: {
                                                            token
                                                          },
                                                          success:  (data) => {
                                                          if(data.code == 10000){
                                                              let indexTitle = document.getElementsByTagName('title')[0];
                                                              indexTitle.innerHTML = '绑定账号';
                                                              localStorage.setItem('isBind',2);
                                                              that.$message({
                                                                type:"success",
                                                                message:"绑定成功"
                                                              })
                                                              setTimeout(()=>{
                                                                   if(window.opener != window){
                                                                          window.opener.location.reload()
                                                                    }
                                                                window.open("about:blank","_self").close()
                                                              },1000);
                                                          }else{
                                                            that.$message({
                                                              message: data.message,
                                                              type: 'error'
                                                            });
                                                            setTimeout(()=>{
                                                              // window.open("about:blank","_self").close()
                                                            },1000);
                                                          }
                                                    }
                                                })
                                                return
                                            }else if(data.bindStatus == 2){
                                              window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=' + C.wbKey + '&redirect_uri='+ location.protocol + '//' + location.host + '/association';
                                            }else if(data.bindStatus == 3){
                                              window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + C.wxKey + '&redirect_uri=' + location.protocol + '//' + location.host + '/association'+'&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect';
                                            }else if(data.bindStatus == 1){
                                                that.$store.dispatch('userLogin', data).then(() => {
                                                })
                                                if(window.opener != window){
                                                    window.opener.location.href = prevUrl
                                                }
                                                window.open("about:blank","_self").close()
                                            }else if(data.bindStatus == 0){
                                              localStorage.setItem('kg_third_openId',data.openId);
                                              localStorage.setItem('kg_bind_data',JSON.stringify(data));
                                              localStorage.setItem('bindData2','11');
                                              that.userInfo = data;
                                              if(window.opener != window){
                                                window.opener.reload()
                                              }
                                              window.open("about:blank","_self").close()
                                            }
                    }else{
                        that.$message({
                          message: data.message,
                          type: 'error'
                        });
                         setTimeout(()=>{
                             window.open("about:blank","_self").close()
                         },1000);
                        that.loginLoading = false
                  }
        }
      })
    }else{
      that.userInfo = bindData;
       if(window.opener != window){
          window.opener.reload()
        }
       window.open("about:blank","_self").close()
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
.association
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
    .account-info
      p.user-face
        margin-bottom 10px
        span
          display inline-block
          width 110px
          height 110px
          background rgba(170, 211, 255, .1)
          border-radius 50%
          padding-top 5px
          img
            width 100px
            height 100px
            border-radius 50%
      p.user-name
        font-size $font-size-medium-x
        margin-bottom 30px
      p.tips-info
        font-size $font-size-medium
        margin-bottom 30px
    .association-btn
      p
        button
          display inline-block
          width 100%
          font-size $font-size-medium-x
          height 48px
        &:first-child
          margin-bottom 20px
        &:last-child
          margin-bottom 50px
</style>
