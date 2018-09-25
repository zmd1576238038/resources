/*
* @Description: 个人中心页
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <el-dialog
    class='modifyModal real-name-modal'
    title="实名认证"
    :visible="visible"
    :close-on-click-modal="false"
    :lock-scroll="false"
    center>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
      <el-form-item label="真实姓名:" prop="name">
        <el-input type="text" v-model="ruleForm.name" size='small' placeholder="2-20个字，请与身份证件中的姓名一致"></el-input>
      </el-form-item>
      <el-form-item label="身份证号:" prop="idCode">
        <el-input type="text" v-model="ruleForm.idCode" size='small' placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="身份证扫描件:" style="height:178px">
        <div class='upload-card'>
          <div>
            <span class='pic'
                  :style="imageUrl.idcard1 ?  {background: 'url(' + imageUrl.idcard1 + ') no-repeat center/cover'} : {background: '#ebebeb'}">{{imageUrl.idcard1 ? '' : '正面'}}</span>
            <el-upload
              class="upload-btn"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :on-exceed="handleExceed"
              :before-upload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary">{{imageUrl.idcard1 ? '重新上传' : '上传'}}</el-button>
            </el-upload>
          </div>
          <div>
            <span class='pic'
                  :style="imageUrl.idcard2 ?  {background: 'url(' + imageUrl.idcard2 + ') no-repeat center/cover'} : {background: '#ebebeb'}">{{imageUrl.idcard2 ? '' : '反面'}}</span>
            <el-upload
              class="upload-btn"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
              :on-exceed="handleExceed"
              :before-upload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary">{{imageUrl.idcard2 ? '重新上传' : '上传'}}</el-button>
            </el-upload>
          </div>
          <div>
            <span class='pic'
                  :style="imageUrl.idcard3 ?  {background: 'url(' + imageUrl.idcard3 + ') no-repeat center/cover'} : {background: '#ebebeb'}">{{imageUrl.idcard3 ? '' : '手持身份证正面照'}}</span>
            <el-upload
              class="upload-btn"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess3"
              :on-exceed="handleExceed"
              :before-upload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary">{{imageUrl.idcard3 ? '重新上传' : '上传'}}</el-button>
            </el-upload>
          </div>
        </div>
        <p class='limit'>不超过2M,支持jpg、png、jpeg等，必须包含身份证正反两面、 手持身份证照片及其日期，且证件中的信息清晰可见</p>
      </el-form-item>
      <el-form-item label="">
        <div class='modal-foot-btn'>
          <el-button type="primary" class='submit-btn' @click="onSubmit('ruleForm')">确认</el-button>
          <el-button class='cancel-btn' @click="cancel('ruleForm')">取消</el-button>
        </div>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import axios from '@/plugins/axios'
  import V from '@/utils/verification'
  import {mapState} from 'vuex'
  import * as imgUrl from '@/config/config'

  export default {
    data() {
      let validateID = (rule, value, callback) => {
        if (value == "") {
          callback(new Error('请输入身份证号'));
        } else if (value != "" && !(V.validateIdCard(value))) {
          callback(new Error('身份证号码输入不正确'));
        } else {
          callback();
        }
      };
      let validateRealName = (rule, value, callback) => {
        if (value == "") {
          callback(new Error('请输入真实姓名'));
        } else if (value != "" && !(V.validateRealName(value))) {
          callback(new Error('真实姓名输入不正确'));
        } else {
          callback();
        }
      };
      return {
        uploadUrl: imgUrl.UPLOAD_IMG_ADDRESS(),
        imgUrl: imgUrl.OSS_ADDRESS,
        ruleForm: {
          name: '',
          idCode: '',
          idcard1: "",
          idcard2: "",
          idcard3: "",
        },
        rules: {
          name: [
            {required: true, validator: validateRealName, trigger: 'blur'},
          ],
          idCode: [
            {required: true, validator: validateID, trigger: 'blur'}
          ],
        },
        imageUrl: {
          idcard1: null,
          idcard2: null,
          idcard3: null,
        }

      }
    },
    props: {
      visible: {},
      realNameVisibleHandle: {},
      getAccountInfo: {}
    },
    components: {},
    computed: {
      ...mapState([
        'KGUser'
      ])
    },
    methods: {
      cancel(formName) {
        this.realNameVisibleHandle(false)
        this.$refs[formName].resetFields()
      },
      onSubmit(formName) {
        const that = this;
        const list = {
          "userId": this.KGUser.userId,
          "realname": this.ruleForm.name,
          "idcardNo": this.ruleForm.idCode,
          "idcardFront": this.ruleForm.idcard1,
          "idcardBack": this.ruleForm.idcard2,
          "idcardPic": this.ruleForm.idcard3,
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (that.ruleForm.idcard1 == '' || that.ruleForm.idcard2 == "" || that.ruleForm.idcard3 == "") {
              that.$message({
                message: '请上传3张证件照片',
                type: 'error'
              });
              return
            }
            this.ajax({
              url: '/lynn/userCert',
              data: list,
              headers: {
                token: that.KGUser.token
              },
              success: (res) => {
                if (res.code == 10000) {
                  that.cancel(formName)
                  that.getAccountInfo()
                  that.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                } else if (res.code == 20118) {
                  that.$message({
                    message: '已有用户使用了你提交的认证信息，请重新提交',
                    type: 'error'
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


      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeAvatarUpload(file) {
        let isTrue = false;
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          isTrue = true;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isTrue) {
          this.$message.error('图片格式不对!');
        }
        if (!isLt2M) {
          this.$message.error('图片大小不能超过 2MB!');
        }
        return isTrue && isLt2M;
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleAvatarSuccess1(res, file) {
        this.ruleForm.idcard1 = res.data[0].filePath;
        this.imageUrl.idcard1 = this.imgUrl + res.data[0].filePath;
      },
      handleAvatarSuccess2(res, file) {
        this.ruleForm.idcard2 = res.data[0].filePath;
        this.imageUrl.idcard2 = this.imgUrl + res.data[0].filePath;
      },
      handleAvatarSuccess3(res, file) {
        this.ruleForm.idcard3 = res.data[0].filePath;
        this.imageUrl.idcard3 = this.imgUrl + res.data[0].filePath;
      },
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'
  @import '../../assets/stylus/personalModal.styl'
  .real-name-modal
    .el-dialog
      width 670px !important
      height 490px
      .el-form-item__content, .el-form-item
        width 100%
      .el-input, .el-input--small .el-input__inner
        width 500px
      .upload-card
        display flex
        flex-direction row
        div
          display flex
          flex-direction column
          margin-right 14px
          .pic
            display inline-block
            width 130px
            height 80px
            line-height 80px
            text-align center
            background #ebebeb
            border $border
        .upload-btn
          width 100%
          .el-upload
            width 100%
            margin-top 10px
          button
            width 100%
            border-radius 0px
            background #2382ea
            border-color #2382ea
      .limit
        width 500px
        line-height 20px
        font-size 12px
        color #666
        margin-top 11px
      .modal-foot-btn
        justify-content flex-start
</style>
