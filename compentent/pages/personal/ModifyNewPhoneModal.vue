/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:57
 */
<template>
        <el-dialog
                class = 'modifyModal'
                title = "修改手机号"
                :visible = "newPhoneVisible"
                :before-close = "beforeClose"
                :close-on-click-modal = "false"
                :lock-scroll = "false"
                center>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                    <el-form-item label=""  class="codePhone" prop="phone">
                      <el-input type="text" v-model="ruleForm.phone" class = 'codePhont-input' size = 'small'  placeholder="请输入手机号" style = "width:230px">
                         <el-select slot="prepend" size = 'small' v-model="select" >
                                  <el-option
                                  v-for="(item,key) in phoneAreaCode"
                                  :key="key"
                                  :label="'+'+item.code"
                                  :value="item.code">
                                  <span style="float: left; color: #8492a6; font-size: 13px">+{{item.code}}</span>
                                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.countryname }}</span>
                        </el-option>
                    </el-select>
                      </el-input>
                    </el-form-item>
                     <!-- 滑块验证 -->
                    <AliBlock blockId="new-phone" cseId="new-cseId" sigId="new-sigId" tokenId="new-tokenId" sceneId="new-sceneId"/>
                    <el-form-item label="" class = 'code-item' prop="code">
                      <el-input type="text"  size = 'small'  v-model="ruleForm.code" placeholder="验证码" ></el-input>
                      <span v-show="!sendMsgDisabled" class="code-btn" @click="sendCode">获取验证码</span>
                      <span v-show="sendMsgDisabled" class="code-btn">重新发送（{{time}}）</span>
                    </el-form-item>
                    <div class = 'modal-foot-btn'>
                      <el-button type = "primary" class = 'submit-btn' @click="submit('ruleForm')">确认</el-button>
                      <el-button class = 'cancel-btn' @click="cancel('ruleForm')">取消</el-button>
                    </div>
              </el-form>
        </el-dialog>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import axios from '@/plugins/axios'
import { mapState, mapActions,mapMutations } from 'vuex'
import areaData from '@/config/phoneAreaCode'
import AliBlock from '@/components/AliBlock/AliBlock'
import { sendMessage } from '@/utils/utils'
import V from '@/utils/verification'

export default {
  data () {
          let validatePhone = (rule, value, callback) => {
         if(value === '') {
          callback(new Error('请输入手机号'));
        } else if(!(V.validatePhone(value))){
          callback(new Error('请正确输入手机号'));
        }
        else {
          callback();
        }
      };
      let validateMail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱'));
        }else if(!(V.validateMail(value))){
           callback(new Error('请正确输入邮箱'));
        } else {
          callback();
        }
      };
      let validateCode= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        }else if(value.length > 6){
           callback(new Error('验证码长度不超过6位数,请检查'));
        } else {
          callback();
        }
      };
      let validateUserPwd = (rule,value,callback) =>{
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(value.length < 6){
           callback(new Error('密码至少6位数'));
        } else {
          callback();
        }
      }
      let validateNewPwd = (rule,value,callback) =>{
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(value.length < 6){
           callback(new Error('密码至少6位数'));
        } else {
          callback();
        }
      }
      let validateConfirm = (rule,value,callback) =>{
        if (value === '') {
          callback(new Error('请输入确认密码'));
        }else if(value !== this.ruleForm.newPwd){
           callback(new Error('两次密码不相同'));
        } else {
          callback();
        }
      }
      let validateConfirm2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm2.newPwd) {
        callback(new Error("两次密码不相同"));
      } else {
        callback();
      }
    };
      let validateName = (rule,value,callback) =>{
        if (value.replace(/(^\s*)|(\s*$)/g,"") == '') {
          callback(new Error('请输入昵称'));
        }else if(!(Lib.V.checkLength(value))){
           callback(new Error('请输入15个字以内的昵称'));
        } else {
          callback();
        }
      }
      let validateResume = (rule,value,callback) =>{
        if (value != '' && value != null && (value.length > 100 || value.length < 10)) {
          callback(new Error('请输入10-100字以内的个人简介'));
        }else {
          callback();
        }
      }
    return {
      ruleForm:{
          phone:'',
          pass: '',
          mail:"",
          name:'',
          code:"",
          userPassword:"",
          newPwd:"",
          confirmPwd:"",
          fixCode:"",
          newPhone:"",
          newEmail:"",
          oldCode:""
      },
      rules: {
          phone: [
            {validator: validatePhone, trigger: 'blur' }
          ],
          newPhone: [
            {validator: validatePhone, trigger: 'blur' }
          ],
          mail: [
            {validator: validateMail, trigger: 'blur' }
          ],
          newEmail: [
            {validator: validateMail, trigger: 'blur' }
          ],
          code:[
            {validator: validateCode, trigger: 'blur' }
          ],
          oldCode:[
            {validator: validateCode, trigger: 'blur' }
          ],
          userPassword:[{
             validator: validateUserPwd, trigger: 'blur'
          }],
          userName:[{
            validator: validateName, trigger: 'blur'
          }],
          newPwd:[{
            validator: validateNewPwd, trigger: 'blur'
          }],
          confirmPwd:[{
           validator: validateConfirm, trigger: 'blur'
          }],
          resume:[{
             validator: validateResume, trigger: 'blur'
          }]
      },
      personInfo:{},
      radio:'',
      areaCode:[],
      select:'86',
      phoneAreaCode:[],
      sendMsgDisabled: false,
      time:5,
    }
  },
  props:{
    fixPhone:{},
    nextStep:{},
    beforeClose:{},
    visible:{},
    handleSlide:{},
    slideInfo:{},
    getAccountInfo:{},
    accountDataHandle:{}
  },
  components: {
    AliBlock
  },
  mounted(){
    this.phoneAreaCode = areaData
  },
  computed: {
     ...mapState([
      'newPhoneVisible',
      'KGUser'
     ])
  },
  methods:{
    ...mapMutations([
      'SET_OLDPHONE_VISIBLE',//设置老手机弹窗 visible
      'SET_NEWPHONE_VISIBLE' //设置新手机弹窗 visible
    ]),
    save(){},
    selected(){},
    selectProvince(){},
    selectArea(){},
    selectCity(){},
    sendCode(){
      const list = {
            "verIfy":this.ruleForm.phone,
            "mobileArea":this.select,
            "valiDation":1,
            "platform":'3',
            "session":this.slideInfo.session,
            "sig":this.slideInfo.sig,
            "token":this.slideInfo.nc_token,
            "scene":this.slideInfo.nc_scene,
      }
      const me = this;
      sendMessage(false, 'ruleForm',list,
        '#new-phone',
        'new-cseId',
        'new-sigId',
        'new-tokenId',
        'new-sceneId',
        me)
    },
    cancel(form){
      this.SET_NEWPHONE_VISIBLE(false)
      this.handleSlide('','','','')
      this.$refs[form].resetFields()
    },
    submit(form){
        const that = this;
        const list = {
            "verIfy":this.ruleForm.phone,
            "code":this.ruleForm.code,
            "call_method":"newVerIfy",
            "userId":this.KGUser.userId,
            "userMobile":this.ruleForm.phone,
        }
        //绑定新手机
         this.ajax({
                    url: '/userkg/centerUped',
                    data: list,
                    headers: {
                      token:that.KGUser.token
                    },
                    success:(res) => {
                      if(res.code == 10000){
                            that.cancel(form)
                            that.$message({
                                    message: '提交成功',
                                    type: 'success'
                            });
                            that.getAccountInfo()
                      }else{
                            that.$message({
                                message: res.message,
                                type: 'error'
                            });
                      }
                    }
        })
      //   axios({url:'/userkg/centerUped',method:'post',headers:{token:that.KGUser.token},data:list})
      //     .then((res) => {
      //           if(res.data.code == 10000){
      //              that.cancel(form)
      //              that.$message({
      //                     message: '提交成功',
      //                     type: 'success'
      //              });
      //              that.getAccountInfo()
      //           }else{
      //                 that.$message({
      //                     message: res.data.message,
      //                     type: 'error'
      //                 });
      //           }
      //         }
      // )
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
.el-input-group__prepend .el-input, .el-input-group__prepend .el-select
  width 70px!important
.el-select-dropdown__item
		padding 0px 5px!important;

.el-input-group__prepend .el-select,.el-input-group__prepend .el-input
			 	width 70px!important;

.el-input-group__prepend div.el-select .el-input__inner
			 	padding 8px!important;

.el-popper[x-placement^=bottom] .popper__arrow
			 	display none;
.codePhone
  margin-bottom 0px
  .el-input-group__prepend input,.el-input-group__prepend .el-input,.el-input,.el-input__inner
    margin-bottom 0px!important
.codePhont-input
  .el-input__inner,.el-input--small
    width 230px!important
  .el-input--suffix
    width 70px!important
.el-select
  .el-input__inner
    width 70px!important

</style>
