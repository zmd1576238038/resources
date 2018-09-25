/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:57
 */
<template>
  <section class = 'account-safe'>
    <!-- 绑定手机 -->
    <section class = 'account-lists'>
      <div>
        <svg-icon v-if="accountData.userMobile" iconClass="draw" class="svg-icon draw"></svg-icon>
        <span v-else-if="!accountData.userMobile" class = 'nobind'></span>
        <span class = 'account-type'>绑定手机</span>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          content="已绑定的手机可以用于登录千氪账号，重置密码或其它安全验证">
          <!--<svg-icon slot="reference" iconClass="info" class="svg-icon info"></svg-icon>-->
        </el-popover>
      </div>
      <div>
        <span class = 'account-state'>{{accountData.userMobile}}</span>
        <span class = 'account-handle' @click = "bindPhone">修改</span>
      </div>
    </section>
    <!-- 绑定微信 -->
    <section class = 'account-lists' v-if="false">
      <div>
        <svg-icon v-if="accountData.bindWeiXin == 1" iconClass="draw" class="svg-icon draw"></svg-icon>
        <span     v-if="accountData.bindWeiXin == 0" class = 'nobind'></span>
        <span class = 'account-type'>绑定微信</span>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          content="已绑定的微信可以用于登录千氪账号，重置密码或其它安全验证">
          <!--<svg-icon slot="reference" iconClass="info" class="svg-icon info"></svg-icon>-->
        </el-popover>
      </div>
      <div>
        <span class = 'account-state'>{{accountData.bindWeiXin == 0 ? '暂未绑定' : '已绑定'}}</span>
        <span @click="accountData.bindWeiXin == 0 ? bindWeibo(1) : unbind(1)" class = 'account-handle'>{{accountData.bindWeiXin == 0 ? '绑定' : '解绑'}}</span>
      </div>
    </section>
    <!-- 绑定微博 -->
    <section class = 'account-lists' v-if="false">
      <div>
        <svg-icon v-if="accountData.bindWeibo == 1" iconClass="draw" class="svg-icon draw"></svg-icon>
        <span     v-if="accountData.bindWeibo == 0" class = 'nobind'></span>
        <span class = 'account-type'>绑定微博</span>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          content="绑定的微博号可以用于微博授权登录千氪账号">
          <!--<svg-icon slot="reference" iconClass="info" class="svg-icon info"></svg-icon>-->
        </el-popover>
      </div>
      <div>
        <span class = 'account-state'>{{accountData.bindWeibo == 0 ? '暂未绑定' : '已绑定'}}</span>
        <span @click="accountData.bindWeibo == 0 ? bindWeibo(0) : unbind(0)" class = 'account-handle'>{{accountData.bindWeibo == 0 ? '绑定' : '解绑'}}</span>
      </div>
    </section>
    <!-- 登录密码 -->
    <section class = 'account-lists'>
      <div>
        <svg-icon v-if="accountData.accountFrom == 1" iconClass="draw" class="svg-icon draw"></svg-icon>
        <span v-else class = 'nobind'></span>
        <span class = 'account-type'>登录密码</span>
        <!--<svg-icon iconClass="info" class="svg-icon info"></svg-icon>-->
      </div>
      <div>
        <span class = 'account-state'>{{accountData.accountFrom === 1 ? '已设置' : '未设置'}}</span>
        <span class = 'account-handle' @click = "accountData.accountFrom === 1?pwdVisible = true:setPwd=true">{{accountData.accountFrom === 1 ? '修改' : '设置'}}</span>
      </div>
    </section>
    <!-- 实名认证 -->
    <section class = 'account-lists'>
      <div>
        <svg-icon v-if="accountData.realnameAuthed == 1 || accountData.realnameAuthed == 2" iconClass="draw" class="svg-icon draw"></svg-icon>
        <svg-icon v-if="accountData.realnameAuthed == 0" iconClass="fork" class="svg-icon fork"></svg-icon>
        <span     v-if="accountData.realnameAuthed == '-1'" class = 'nobind'></span>
        <span class = 'account-type'>实名认证</span>

        <span class="refuseReason" v-if = "accountData.realnameAuthed == 0 && accountData.refuseReason">未通过原因：{{accountData.refuseReason}}</span>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          content="通过实名认证后，您将获得转出资产的资格">
          <!--<svg-icon slot="reference" iconClass="info" class="svg-icon info"></svg-icon>-->
        </el-popover>
      </div>
      <div>
        <span v-if="accountData.realnameAuthed == '-1'" class = 'account-state'>未认证</span>
        <span v-if="accountData.realnameAuthed == 2"    class = 'account-state'>审核中</span>
        <span v-if="accountData.realnameAuthed == 0"    class = 'account-state'>不通过</span>
        <span v-if="accountData.realnameAuthed == 1"    class = 'account-state'>已认证</span>
        <span class="account-handle" @click = "realNameVisible = true" v-if = "accountData.realnameAuthed == '-1'">认证</span>
        <span class="account-handle" @click = "realNameVisible = true" v-if = "accountData.realnameAuthed == 0">重新认证</span>
        <span class="account-handle" @click = "showApprove" v-if = "accountData.realnameAuthed == 1 || accountData.realnameAuthed == 2">查看</span>
      </div>
    </section>
    <!-- 交易密码 -->
    <section class = 'account-lists'>
      <!-- tradepasswordSet -->
      <div>
        <svg-icon v-if="accountData.tradepasswordSet != 0" iconClass="draw" class="svg-icon draw"></svg-icon>
        <span v-else class = 'nobind'></span>
        <span class = 'account-type'>交易密码</span>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          content="转出资产时需要交易密码">
          <!--<svg-icon slot="reference" iconClass="info" class="svg-icon info"></svg-icon>-->
        </el-popover>
      </div>
      <div>
        <span class = 'account-state'>{{accountData.tradepasswordSet == 0 ? '未设置':'已设置'}}</span>
        <span class = 'account-handle'  @click="traderPwdHandle">{{accountData.tradepasswordSet == 0 ? '设置':'修改'}}</span>
      </div>
    </section>
    <!-- 修改手机号弹窗 -->
    <modify-phone  :accountData="accountData" :slideInfo="slideInfo" :handleSlide="handleSlide" :getAccountInfo="getAccountInfo" :accountDataHandle="accountDataHandle"/>
    <!-- <modify-phone :visible = "oldPhoneVisible"/> -->
    <!-- 修改、设置密码弹窗 -->
    <modify-pwd :accountData="accountData" :visible="pwdVisible" :pwdVisibleHandle="pwdVisibleHandle"/>
    <set-pwd v-if="setPwd" :visible="setPwd" :slideInfo="slideInfo" :handleSlide="handleSlide" :accountData="accountData" :traderVisibleHandle="setPwdHandle" :getAccountInfo="getAccountInfo"></set-pwd>
    <!-- 设置、修改交易密码 -->
    <trader-pwd :visible="traderVisible" :slideInfo="slideInfo" :handleSlide="handleSlide" :accountData="accountData" :traderVisibleHandle="traderVisibleHandle" :getAccountInfo="getAccountInfo"/>
    <!-- 实名认证 弹窗 -->
    <real-name  :visible="realNameVisible" :realNameVisibleHandle="realNameVisibleHandle" :getAccountInfo="getAccountInfo"/>
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import axios from '@/plugins/axios'
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import ModifyPhone from './ModifyOldPhoneModal'
import ModifyPwd from './ModifyPwdModal'
import SetPwd from './SetPwdModal'
import TraderPwd from './TraderPwdModal'
import RealName from './RealNameModal'
import { handleRequestParams, aliBlock, handleWebStorage } from '@/utils/utils'
import { mapState, mapMutations } from 'vuex'
import { weiboBind, wxBind } from '@/assets/js/common'
import Common from '@/assets/js/common'

export default {

  data () {
    return {
      // oldPhoneVisible:true,
      setPwd:false,
      pwdVisible:false,
      traderVisible:false,
      realNameVisible:false,
      oldVisible:false,
      accountData:{},
      //滑块验证信息
      slideInfo:{
        'session':'',
        'sig':'',
        'nc_token':'',
        'nc_scene':''
      }
    }
  },
  components: {
    SvgIcon,ModifyPhone,ModifyPwd,TraderPwd,RealName,SetPwd
  },
  computed: {
    ...mapState([
      'KGUser'
    ])
  },
  mounted(){
    this.getAccountInfo()
    if(handleWebStorage.getLocalData('approve_open') == 2){
        this.realNameVisible = true
    }else if(handleWebStorage.getLocalData('trader_pwd') == 2){
        this.traderVisible = true
    }
  },
  methods:{
    ...mapMutations([
      'SET_OLDPHONE_VISIBLE',
      'SET_TRADERPWD_VISIBLE',
      'SET_PERSONAL_ACCOUNTINFO', //设置个人账户资料
      'SET_SLIDE_INFO'
    ]),
    //解除绑定
    unbind(res){
      const that = this;
      const str = res == 0 ?'微博':'微信'
        this.$confirm('是否要解除'+str+'绑定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          customClass:'bindMessageBox'
        }).then(() => {
          const getPhone = {
            "userId":that.KGUser.userId,
            "openType":res,
          }
          that.ajax({
                  url: '/thirdParty/unbind',
                  data:getPhone,
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (data) => {
                       if(data.code == 10000){
                            if(res == 0){
                              that.isBindWeibo = false;
                            }else{
                              that.isBindWx = false;
                            }
                            that.$message({
                                  message: '解绑成功',
                                  type: 'success'
                            });
                            //更新账户安全数据
                            that.getAccountInfo()
                        }else{
                            that.$message({
                                  message: data.message,
                                  type: 'error'
                            });
                        }
                    }
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '取消解绑'
          });
        });
    },
    //绑定
    bindWeibo(data){
      handleWebStorage.setLocalData('prevUrl', location.pathname, 'sessionStorage')
      if(data == 0){
        weiboBind()
      }else{
        wxBind()
      }
    },
    showApprove(){
        const html = "<div><p><span class = 'html_span'>真实姓名:</span><span>"+this.accountData.realName+"</span></p><p><span class = 'html_span'>身份证号:</span><span>"+this.accountData.idcardNo+"</span></p><p><span class = 'html_span'>身份证扫描件:</span><span>已上传</span></p></div>"
        this.$alert(html, '实名认证信息', {
          dangerouslyUseHTMLString: true,
          lockScroll : false,
          customClass:'approveMessageBox',
          center:true
        });
    },
    getAccountInfo(){
            const that = this;
             this.ajax({
                  url: '/userkg/getuserdetails',
                  data: {
                    userId:that.KGUser.userId
                  },
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (res) => {
                      if(res.code == 10000){
                                res = res.responseBody.data
                                that.accountDataHandle(res)
                    }else{
                        that.$message({
                            message: res.message,
                            type: 'error'
                        });
                      }
                    }
                })
    },
    bindPhone(){
      this.SET_OLDPHONE_VISIBLE(true)
      const me = this;
      function noHandle(){}
      setTimeout(function(){
          aliBlock(
            "#old-phone",
            me,
            "old-cseId",
            "old-sigId",
            "old-tokenId",
            "old-sceneId"
          );
      },200)
    },
    traderPwdHandle(){
        // this.SET_TRADERPWD_VISIBLE(true)
        this.traderVisible = true
        const me = this;
        setTimeout(function(){
          aliBlock(
            "#traderpwd",
            me,
            "traderpwd-cseId",
            "traderpwd-sigId",
            "traderpwd-tokenId",
            "traderpwd-sceneId"
          );
        },200)
    },
    handleSlide(session,sig,nc_token,nc_scene){
        this.slideInfo.session = session
        this.slideInfo.sig = sig
        this.slideInfo.nc_token = nc_token
        this.slideInfo.nc_scene = nc_scene
    },
    accountDataHandle(res){
      this.accountData = res
    },
    //修改密码弹窗显示
    pwdVisibleHandle(res){
      this.pwdVisible = res
    },
    //交易密码弹窗显示
    traderVisibleHandle(res){
      this.traderVisible = res
    },
    // 设置新密码弹窗显示
    setPwdHandle(res){
      this.setPwd = res
    },
    //实名认证弹窗显示
    realNameVisibleHandle(res){
      this.realNameVisible = res
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.account-safe
  height 486px
  padding 50px
  background-color #fff
  .account-lists
    flex-row-space-between()
    height 62px
    line-height 62px
    font-size 14px
    color #333
    border-bottom $border
    div
      display flex
      margin-top 19px
    span
      display inline-block
      height 20px
      line-height 20px
    .account-type
      margin-left 16px
      margin-right 8px
    .account-state
      margin-right 30px
    .account-handle
      color #1373DB
      cursor pointer
      display inline-block
      width 60px
    .draw
      width 20px
      color #3CBC98
    .fork
      width 20px
      color #FC5A5D
    .info
      color #9B9B9B
      cursor pointer
    .refuseReason
      width 588px
      height 40px
      word-break break-all
      margin-left 15px
      color $color-text-red
      no-wrap()
    .nobind
      display inline-block
      width 18px
      height 18px
      border-radius 50%
      border 1px solid #fc5a5d
      background #ffe5e5
      margin-top 1px
 .approveMessageBox
    width 400px
    height 215px
    padding 0px
    .el-message-box__header
      padding 21px 0px
      border-bottom $border
    .el-message-box__content
      padding 27px 30px
    .el-message-box__message
      p
        text-align left
        font-size 14px
        color #666
        margin-bottom 12px
        .html_span
          display inline-block
          color #333
          width 140px
    .el-message-box__btns
      display none

</style>
