<template>
    <div>
      <el-dialog
          :visible="visible"
          width="500px"
          :before-close = "cancel"
          class = 'reward-modal'
          title = "打赏"
          center>
          <!-- onkeyup= "if( ! /^d*(?:.d{0,2})?$/.test(this.value)) -->
          <!-- if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d$/.test(value))event.returnValue=false -->
          <div class = 'tags'>
            <span class="active_tag award_tag cursorPointer num-tag" v-for = "(item,index) in data" :key="index" @click = 'tagChecked(item)'>{{item.label}}</span>
            <span v-if = 'inputVisible' class='award_tag cursorPointer custom_input' @click = 'custom'>自定义</span>
            <div v-else class = 'cutomContent'>
              <el-input    @change = "onChange(form.value)" id = "custom_input" class = 'custom_input'  v-model = "form.value" type="text"  placeholder = "自定义"
                onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d\d$/.test(value))event.returnValue=false"
                  onkeyup='this.value=this.value.replace(/^[\u4e00-\u9fa5]+$/,"")'

              ></el-input>
              <span>TV</span>
            </div>
          </div>
          <el-form >
                <span class = 'explain'>说明：每天最多打赏5次，每次最多100钛值</span>
                <!-- <el-form-item class = 'footer_btn martop10'>
                      <el-button   @click="cancel"  class=" btnModal" >取消</el-button>
                      <el-button   @click="nextStep" type="primary"  class=" btnModal2">确定</el-button>
                </el-form-item> -->
                <div class = 'modal-foot-btn'>
                      <el-button type = "primary" class = 'submit-btn' @click="nextStep">确认</el-button>
                      <el-button class = 'cancel-btn' @click="cancel">取消</el-button>
                </div>
          </el-form>

        </el-dialog>
           <el-dialog
          :visible="pswVisible"
          title="确认为Ta打赏吗？"
          width="500px"
          :before-close = "cancelPws"
          class = 'reward-modal'
          center>
          <el-form   :model="form"  :rules="rules" ref="form">
               <el-form-item prop = 'password'>
                        <el-input
                         class = 'martop10'
                          v-model = "form.password"
                          type="password"
                          placeholder="请输入交易密码"
                          onpaste="return false"  oncopy="return false" oncut="return false"
                          onkeypress="if(event.keyCode== 13)event.returnValue=false"
                           ></el-input>
                </el-form-item>
                <span class = 'martop10 toTraderPwd'>如果还没有交易密码，请去<a class = 'color1d87' @click = "toTraderPwd">设置交易密码</a></span>
                 <!-- <el-form-item class = 'footer_btn martop10'>
                      <el-button   @click="cancelPws('form')"  class=" btnModal" >取消</el-button>
                      <el-button  :loading = "loading" @click="onSubmit('form')" type="primary"  class=" btnModal2">确定</el-button>
                </el-form-item> -->
                <div class = 'modal-foot-btn'>
                      <el-button :loading="loading" type = "primary" class = 'submit-btn' @click="onSubmit('form')">确认</el-button>
                      <el-button class = 'cancel-btn' @click="cancelPws('form')">取消</el-button>
                </div>
          </el-form>
        </el-dialog>

    </div>
</template>

<script>

import axios from '@/plugins/axios'
import { handleWebStorage } from '@/utils/utils'
import { mapState, mapActions,mapMutations } from 'vuex'


export default {
  data() {
      var validateValue = (rule, value, callback) => {
         if(value > 100) {
          callback(new Error('每次最多100TV'));
        }else {
          callback();
        }
      };
    return {
      data:[
          {'value':"1","label":"1TV","iscur":"true"},
          {'value':"3","label":"3TV","iscur":"false"},
          {'value':"5","label":"5TV","iscur":"false"},
          {'value':"10","label":"10TV","iscur":"false"},
          {'value':"15","label":"15TV","iscur":"false"},
          {'value':"20","label":"20TV","iscur":"false"},
          {'value':"30","label":"30TV","iscur":"false"},
          {'value':"50","label":"50TV","iscur":"false"},
      ],
      checkedVal:"1",
      pswVisible:false,
      form:{
        password:'',
        value:'',
      },
      rules: {
          password: [
            { required: true, message: '请输入交易密码', trigger: 'blur' },
            { min: 6, max: 6, message: '请输入6位交易密码（数字）', trigger: 'blur' }
          ],
          value:[
              { validator: validateValue, trigger: 'blur' }
          ]
      },
      inputVisible:true,
      loading:false,
    }
  },
  computed: {
      ...mapState([
        'KGUser'
      ])
  },
  components: {},
  mounted(){
  },
  props: {
    visible:{},
    cancel:{},
    articleId:{},
    //更新打赏数
    updateTipsinCount:{}
  },
  //相关操作事件
  methods: {
    returnFalse(){
      return false
    },
    cancelPws(formName){
      // this.cancel()
      this.pswVisible = false
      this.$refs[formName].resetFields();
    },
    toTraderPwd(){
      handleWebStorage.setLocalData('trader_pwd',2)
      window.open ("../personal#account")
    },
    onChange(value){
        let reg = /^[1-9]\d*$/;
        let han = /^[\u4e00-\u9fa5]+$/;
        if (value) {
            if (value > 999999 || new RegExp(reg).test(value)) {
              console.log('1')
                value ='';
            }else if(new RegExp(han).test(value)){
              console.log(2)
                value = '';
            }
        }

    },
    custom(){
      let tags = document.getElementsByClassName('award_tag');
          // custom_input.select();
          this.$nextTick(function(){
      const custom_input = document.getElementById('custom_input');
      const custom_input1 = document.getElementsByClassName('custom_input')[0];
          })
          // document.execCommand("Copy")
      for(var i = 0,l = tags.length;i < l;i++){
          //  tags[i].style.backgroundColor = "#fff"
           tags[i].style.color = "#333"
           tags[i].style.borderColor = "#EBEBEB"
      }
      this.checkedVal = ''
      this.form.value = '';
      this.inputVisible = false;

    },
    nextStep(){
      var han = /^[\u4e00-\u9fa5]+$/;
      console.log('han.test(this.form.value)',han.test(this.form.value))
      if(han.test(this.form.value)){
        this.$message({
                 message:'请输入0.001-100的数字',
                type: 'warning'
        });
        return
      }
      if(this.form.value == '' && this.checkedVal == ''){
            this.$message({
                 message:'请输入或者选择要打赏的金额',
                type: 'warning'
            });
            return
      }else if(this.form.value != "" && (this.form.value < 0.001 || this.form.value > 100)){
             this.$message({
                 message:'请输入0.001-100钛值的打赏金额',
                type: 'warning'
            });
      }else{
        this.pswVisible = true
      }
    },
    onSubmit(form){
      const that = this;
      let userId = ''
      let token = ''
      if (this.$store.state.KGUser) {
        userId = this.$store.state.KGUser.userId
        token = this.$store.state.KGUser.token
      }

        this.$refs[form].validate((valid) => {
          if (valid) {
                  const award_list = {
                              "articleId":this.articleId,
                              "userId":userId,
                              "balance":this.form.value == ''? this.checkedVal:this.form.value,
                              "txPassword":this.form.password,
                   }
                  that.loading = true;
                  that.ajax({
                    url: '/account/updateBalance',
                    data: award_list,
                    headers: {
                      token
                    },
                    success: function(data){
                          that.loading = false
                          if(data.code == 10000){
                                    that.$message({
                                      message:'打赏成功',
                                      type: 'success'
                                    });

                                    that.pswVisible = false
                                    that.cancel()
                                    that.$refs[form].resetFields();
                                    that.updateTipsinCount()
                          }else{
                              that.$message({
                                message: data.message,
                                type: 'error'
                              });
                          }
                    }
                  })
          } else {
            return false;
          }
        });


    },
    tagChecked(item){
      let tags = document.getElementsByClassName('award_tag');
      for(var i = 0,l = tags.length;i < l;i++){
        if(tags[i].innerText == item.label){
            // tags[i].style.backgroundColor = "#1d87ff"
            // tags[i].style.color = "#333"
            tags[i].style.borderColor = "#1d87ff"
        }else{
          //  tags[i].style.backgroundColor = "#fff"
           tags[i].style.borderColor = "#EBEBEB"
          //  tags[i].style.color = "#333"
        }
      }
      this.form.value = "";
      this.checkedVal = item.value;
      this.inputVisible = true;
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
@import '../../assets/stylus/personalModal.styl'

  .reward-modal .el-dialog__body
      // padding 0px 20px 20px
  .reward-modal .el-dialog--center .el-dialog__header
      border-bottom $border
  .reward-modal .el-form-item
    margin-bottom 2px
  .custom_input input
    display inline-block
    width 94%!important
    margin-right 0px!important
    height 38px
    line-height 38px
    text-align left
    background #fff
    /*margin:10px;*/
    border-radius 0px
  .cutomContent .custom_input, .cutomContent .custom_input input
    width 100%!important
    border-radius 0px
  .reward-modal .el-input__inner
    border-radius 0px
  .reward-modal p
    text-align center
    font-size 20px
    font-weight bold
  .tags
    width 100%
    padding 0px 12px
  .reward-modal .award_tag
    display inline-block
    width 123px
    height 40px
    line-height 40px
    text-align center
    border 1px solid #EBEBEB
    background: #fff
    color #333
    margin 10px 15px 0px 0px
    cursor pointer
  .footer_btn
    text-align center
  .active_tag
    background-color #1d87ff
    color #fff
  .award_tag:nth-child(1)
    // background-color #1d87ff
    color #333
    border-color #1d87ff
  .tags .num-tag:last-child
    width 261px
  .cutomContent span
    position absolute
    top 9px
    right 10px
    background #fff
    z-index 100
  .custom_input
    border none
    width 94%!important
    margin-right 0px!important
  .toTraderPwd
    display block
    margin-top 15px
  .cutomContent
    position relative
    width 95%
    border-radius 4px
    margin-top 10px
  .explain
    margin 21px 13px 6px 13px
    display inline-block
    color #FC5A5D
  .color1d87
    color #2382EA
    cursor pointer
</style>

