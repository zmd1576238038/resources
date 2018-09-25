/*
* @Description: 个人中心页
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:10
*/
<template>
  <section class='all'>
    <header class='roll-out-header'>
      <span>转出钛值</span>
      <span class='out-detail' @click='rollOutHandle'>转出明细</span>
    </header>
    <div class='roll-out-container'>
      <div v-if="isOuting">
        <table class='shiftout_table'>
          <thead>
          <tr>
            <th>时间</th>
            <th>转出地址</th>
            <th>转出数量</th>
            <th>手续费</th>
            <th>到账数量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{tableData.flowDate}}</td>
            <td>{{tableData.txAddress}}</td>
            <td>{{tableData.amount}}</td>
            <td>{{tableData.poundageAmount}}</td>
            <td>{{tableData.accountAmount}}</td>
            <td>审核中</td>
            <td @click='revocationVisible = true' class='revocation'>撤销</td>
          </tr>
          </tbody>
        </table>
        <p class='explain'>说明：当前这笔转出成功后，您才能进行下一笔转出操作</p>
      </div>
      <div class='outContainer'>
        <el-form label-width="100px" ref="form" :model="form" :rules="rules" size="small" class="roll_out_form">
          <div class='outInfo'>
            <span>可用余额:</span>
            <span class='marR100'>{{tableData.balance}}</span>
            <span>提币手续费:</span>
            <span class='marR100'>0.2%/笔</span>
            <span>最少提币:<span>{{tableData.actionMinTimes}}</span>钛值/每笔</span>
          </div>
          <el-form-item label="转出地址:" prop='txAddress'>
            <el-input v-model="form.txAddress" :disabled="isOuting" type="text" class="el-input"></el-input>
          </el-form-item>
          <el-form-item label="转出数量:" prop='amount'>
            <el-input v-model="form.amount" :disabled="isOuting" type="number" class="el-input" @input="calculateAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="form.remark" :disabled="isOuting" type="text" class="el-input"></el-input>
          </el-form-item>
          <el-form-item label="到账数量:" prop='poundageAmount'>
            <el-input v-model="form.poundageAmount" :disabled="isOuting" type="text" class="el-input"></el-input>
          </el-form-item>
          <el-form-item label="手机验证:">
            <el-input type="text" v-model="filterPhone" :disabled="true" auto-complete="off"/>
          </el-form-item>
          <el-form-item class="code-item" label="验证码:" prop='code'>
            <el-input type="text" size="small" :disabled="isOuting" placeholder="验证码" v-model="form.code"></el-input>
            <span v-show="!sendMsgDisabled && !isOuting" class="code-btn" @click="sendCode">获取验证码</span>
            <span v-show="isOuting" class="code-btn disabled-code">获取验证码</span>
            <span v-show="sendMsgDisabled && !isOuting" class="code-btn" @click="sendCode">重新发送（{{time}}）</span>
          </el-form-item>
          <el-form-item label="交易密码:" prpo='txPassword'>
            <el-input v-model="form.txPassword" :disabled="isOuting" type="password" class="el-input"></el-input>
          </el-form-item>
          <el-form-item label="" class="btm-item">
            <!-- <el-button type = 'primary' :disabled='formDisabled'  @click = "submit('form')">确认转出</el-button> -->
            <el-button class='submit-button' :type='canSubmit?"primary":"info"' :disabled="isOuting"
                       @click="submit('form')">确认转出
            </el-button>
            <p class='b-text'>对转出钛值有疑问，您可以拨打客服电话：{{serviceTel}}</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <ali-code :visible="codeVisible" :cancel="cancelCode" blockId="roll-out-id" cseId="roll-out-cseId"
              sigId="roll-out-sigId" tokenId="roll-out-tokenId" sceneId="roll-out-id-sceneId"/>
    <msg-box :visible="revocationVisible" :cancel="revocationCancle" :submit="onRevocation" :text="revocationText"/>
  </section>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import axios from '@/plugins/axios'
  import {mapState, mapMutations} from 'vuex'
  import {handleRequestParams, aliBlock, sendMessage, handleWebStorage} from '@/utils/utils'
  import C from '@/utils/personal'
  import AliCode from '@/components/AliCode/AliCode'
  import MsgBox from '@/components/MsgBox/MsgBox'

  export default {
    data() {
      let validateAmount = (rule, value, callback) => {
        if (value > this.tableData.balance) {
          callback(new Error(`您当前可转出${this.tableData.balance} TV，请修改转出数量`));
        } else if (value == '') {
          callback(new Error('请输入转出数量'));
        } else if (value < this.tableData.actionMinTimes) {
          callback(new Error('小于最低转出额度'));
        } else {
          callback()
        }
      };
      return {
        revocationText: '您确定要撤销这笔转出申请吗？',
        revocationVisible: false,
        codeVisible: false,
        form: {
          code: '',
          txAddress: "",
          amount: "",
          txPassword: "",
          poundageAmount: "",
          remark: ""
        },
        rules: {
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
          ],
          txAddress: [
            {required: true, message: '请输入转出地址', trigger: 'blur'},
          ],
          amount: [
            {required: true, validator: validateAmount, trigger: 'blur'}
          ],
          txPassword: [
            {required: true, message: '请输入交易密码', trigger: 'blur'}
          ],
        },
        tableData: {},
        formDisabled: false,
        atskMobile: '',
        isOuting: false,
        interval: null,
        time: 5,
        sendMsgDisabled: false,
        isApprove: false,
        slideInfo: {
          'session': '',
          'sig': '',
          'nc_token': '',
          'nc_scene': ''
        }
      }
    },
    components: {
      AliCode, MsgBox
    },
    computed: {
      ...mapState([
        'serviceTel',
        'KGUser'
      ]),
      filterPhone() {
        let reg = /^(\d{3})\d{4}(\d{4})$/;
        if (this.tableData && this.tableData.userMobile) {
          return this.tableData.userMobile.replace(reg, '$1****$2')
        } else {
          return ''
        }
      },
      canSubmit() {
        if(this.form.txAddress && this.form.code && this.form.amount && this.form.txPassword && this.form.amount<this.tableData.balance && this.form.amount>=this.tableData.actionMinTimes){
          return true
        }else {
          return false
        }
      }
    },
    mounted() {
      this.getRollOutInfo()
    },
    methods: {
      ...mapMutations([
        'SET_MODULE_PICK'
      ]),
      revocationCancle() {
        this.revocationVisible = false
      },
      getRollOutInfo() {
        const that = this;
        this.ajax({
          url: '/account/auditAmount',
          data: {
            userId: that.KGUser.userId
          },
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            if (res.code == 10000) {
              that.tableData = res.responseBody.data
              that.isOuting = that.tableData.flowStatus == null ? false : true;
            } else {
              that.$message({
                message: res.message,
                type: 'error'
              });
            }
          }
        })
      },
      rollOutHandle() {
        handleWebStorage.setLocalData('roll_out_open', 2)
        this.SET_MODULE_PICK('MyTreasure')
        C.redirect('#')
      },
      copy() {
        const value = document.getElementById("copyInput");
        value.select();
        document.execCommand("Copy");
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      },
      onRevocation() {
        const that = this;
        //撤销成功
        const list = {
          "userId": this.KGUser.userId,
          "withdrawFlowId": that.tableData.withdrawFlowId,
          "status": 2
        };
        this.ajax({
          url: '/accountFlow/undoUserTimes',
          data: list,
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            if (res.code == 10000) {
              that.getRollOutInfo()
              that.revocationCancle()
              that.$message({
                message: '提交成功',
                type: 'success'
              });
            } else {
              that.getRollOutInfo()
              that.revocationCancle()
              that.$message({
                message: res.message,
                type: 'error'
              });
            }
          }
        })
      },
      calculateAmount(val) {
        this.form.poundageAmount = val - val * 0.002;
      },
      submit(form) {
        const that = this;
        const list = {
          "userId": this.KGUser.userId,
          "code": this.form.code,
          "txAddress": this.form.txAddress,
          "amount": this.form.amount,
          "txPassword": this.form.txPassword,
          "accountAmount": this.form.poundageAmount,
          "userMobile": this.tableData.userMobile,
          "remark": this.form.remark
        };
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.ajax({
              url: '/accountFlow/addUserTimes',
              data: list,
              headers: {
                token: that.KGUser.token
              },
              success: (res) => {
                if (res.code == 10000) {
                  that.getRollOutInfo()
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
          } else {
            return false;
          }
        });
      },
      sendCode() {
        this.codeVisible = true
        const that = this;
        setTimeout(function () {
          aliBlock("roll-out-id", that, "roll-out-cseId", "roll-out-sigId", "roll-out-tokenId", "roll-out-id-sceneId", that.countDown)
        }, 200)
      },
      countDown(id, csessionid, sig, token, scene) {
        this.codeVisible = false
        const me = this
        const list = {
          "verIfy": this.tableData.userMobile,
          "mobileArea": this.tableData.mobileArea,

          "platform": '3',
          "session": this.slideInfo.session,
          "sig": this.slideInfo.sig,
          "token": this.slideInfo.nc_token,
          "scene": this.slideInfo.nc_scene,
        }
        sendMessage(1, 'form', list, id, csessionid, sig, token, scene, me)
      },
      cancelCode() {
        this.codeVisible = false
      },
      handleSlide(session, sig, nc_token, nc_scene) {
        this.slideInfo.session = session
        this.slideInfo.sig = sig
        this.slideInfo.nc_token = nc_token
        this.slideInfo.nc_scene = nc_scene
      }
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'
  @import '../../assets/stylus/personalModal.styl'

  .all
    position relative
    .roll-out-header
      display flex
      flex-direction row
      justify-content space-between
      border-bottom 1px solid #E1E0E1
      font-size 14px
      color #666
      margin-bottom 20px
      span:nth-child(1)
        padding-bottom 15px
        border-bottom 2px solid $color-text-active
      span:nth-child(2)
        cursor pointer

  .roll-out-container
    width 100%
    background #fff
    padding 30px
    padding-bottom 60px
    font-size 14px
    color #333
    .shiftout_table
      width 100%
      border 1px solid #e1e0e1
      border-collapse collapse
      margin-bottom 10px
    .shiftout_table th, .shiftout_table td
      padding 13px 0px
      padding-left 10px
      text-align left
      background #f5f5f5
      border 1px solid #e1e0e1
    .shiftout_table td
      background #fff
    .explain
      font-size 14px
      color $color-text-red
      font-weight 100
      margin-bottom 16px
    .outInfo
      padding 15px 0px
      border-top $border
      border-bottom $border
      margin-bottom 16px
    .marR100
      margin-right 100px
    .el-form-item--small .el-form-item__label
      color #9b9b9b
      text-align left
    .el-input.is-disabled .el-input__inner
      width 382px
      height 40px
      line-height 40px
      border-radius 0px
    .submit-button
      width 170px
      height 40px
      font-size 14px
      border-radius 0px
    .b-text
      width 100%
      margin-top 28px
      font-size 16px
      color #333
    .online
      color #1373DB

  .roll_out_form
    .el-form-item__content
      width 382px
    .el-input--small .el-input__inner
      height 40px
      line-height 40px
      border-radius 0px
    .code-btn
      top 5px

  .disabled-code
    color #9B9B9B

  .btm-item
    .el-form-item__content
      width 100%

  .revocation
    color #2382EA
    cursor pointer

  // .rollOutMesgBox
  //   width 400px
  //   height 197px
  //   padding 0px
  //   .el-message-box__header
  //     border-bottom $border
  //     padding 20px 0px
  //   .el-message-box__content
  //     padding 26px 15px

</style>
