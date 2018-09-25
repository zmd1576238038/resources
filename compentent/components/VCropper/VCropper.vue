/*
* @Description: 头像裁剪框
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <section>
    <el-dialog
      title="上传头像"
      class='avatarModal'
      :visible="visible"
      :before-close="closeModal"
      center>

      <div class="wrapper" v-if="vIf">
        <no-ssr>
          <vue-cropper
            class='corpper checkedImg'
            ref="cropper"
            :img="checkedImg"
            :canMove="false"
            :outputSize="option.size"
            :outputType="option.outputType"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedNumber="option.fixedNumber"
            :info="true"
            :canScale='false'
            :fixed="true"
            @realTime="realTime"
            :full="option.full"
          ></vue-cropper>
        </no-ssr>
      </div>
      <div class='wrapper previewImgContainer' v-if="!vIf">
        <img :src="handleImgAddrHandle(personInfo.avatar)" class='previewImg'/>
      </div>
      <div class='previewContainer' v-if="vIf">
        <p>头像预览</p>
        <img class="img120" :src="previews"/>
        <p>90px*90px</p>
        <img class="img70 " :src="previews"/>
        <p>50px*50px</p>
        <img class="img30 " :src="previews"/>
        <p>30px*30px</p>
      </div>

      <div class='previewContainer' v-if="!vIf">
        <p>预览</p>
        <img class="img120" :src="handleImgAddrHandle(personInfo.avatar)"/>
        <p>90px*90px</p>
        <img class="img70 " :src="handleImgAddrHandle(personInfo.avatar)"/>
        <p>50px*50px</p>
        <img class="img30 " :src="handleImgAddrHandle(personInfo.avatar)"/>
        <p>30px*30px</p>
      </div>

      <div class='uploadbtn'>
        <input id='uploadInput' class='cursorPointer' type='file' name="coverImg" accept="image/jpeg,image/png"
               multiple="multiple"
               @change="coverImgChang($event)"
        />
        <button class='primay-btn cursorPointer'>上传图片</button>
      </div>
      <span class='warningTil'>不超过2M，支持jpg、png、jpeg等格式</span>
      <div class='modal-foot-btn'>
        <el-button :loading="loadVisible" type="primary" class='submit-btn' @click="submit">确认</el-button>
        <el-button class='cancel-btn' @click="closeModal">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import axios from '@/plugins/axios'
  import axiosPost from 'axios';
  import JQ from 'jquery'
  import {mapState} from 'vuex'
  import {handleImgAddr} from '@/utils/utils'
  import Config from '@/assets/js/config'

  export default {
    data() {
      return {
        option: {
          size: 1,
          outputType: 'png',
          full: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 120,
          autoCropHeight: 120,
          fixedNumber: [1, 1],
        },
        blobData: "",
        previews: '',
        checkedImg: require('../../assets/img/login/login-left-background-img.png'),
        vIf: false,
        loading: false,
        imgUrl: '',
        loadVisible: false
      }
    },
    props: {
      visible: {},
      cancel: {},
      initSrc: {},
      roleId: {},
      fromthird: {},
      callback: {},
      personInfo: {}
    },

    beforeCreate() {
      if (process.browser) {
        const VueCropper = require('vue-cropper')
        Vue.use(VueCropper)
        Vue.component('vue-cropper', VueCropper)
      }
    },
    computed: {
      ...mapState([
        'KGUser'
      ])
    },
    methods: {
      closeModal() {
        this.cancel()
        this.vIf = false
      },
      submit() {
        const that = this;
        if (this.blobData == '') {
          this.loading = false
          this.closeModal()
          return
        }
        let formData = new FormData();
        formData.append('name', 'file');
        formData.append('file', this.blobData);
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.loadVisible = true;
        axiosPost.post(Config.uploadImgUrlHost, formData, config).then((res) => {
          res = res.data
          if (res.errorCode == 10000) {
            let list = {
              "userId": that.KGUser.userId,
              "avatar": res.data[0].filePath,
            }
            axios({
              url: '/userprofile/updateProfile',
              method: 'post',
              headers: {token: that.KGUser.token},
              data: list
            }).then(
              (data) => {
                if (data.data.code == 10000) {
                  that.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  that.callback()
                  that.closeModal()
                  that.loadVisible = false
                  that.vIf = false
                } else {
                  that.$message({
                    message: data.data.message,
                    type: 'error'
                  })
                  that.loadVisible = false
                  that.vIf = false
                }
              }
            )
          }
        }).catch(function (error) {
          that.$message({
            message: '当前网络较忙，请稍后再试',
            type: 'warning'
          });
          that.closeModal()
          that.loadVisible = false
          that.vIf = false
        })
      },
      realTime(data) {
        this.previewsHandle()
      },
      previewsHandle() {
        const that = this;
        this.$refs.cropper.getCropBlob((data) => {
          that.blobData = data
        })
        this.$refs.cropper.getCropData((data) => {
          this.previews = data;
        })
      },
      coverImgChang(e) { //选择图片
        const that = this;
        var fileList = e.target.files[0]
        //现在图片文件大小
        var imgSize = fileList.size;
        const type = fileList.type;
        //将图片文件转换为base64
        var reader = new FileReader();
        if (imgSize > 2 * 1024 * 1024 || (type != "image/png" && type != "image/jpeg")) {
          this.$message({
            type: "warning",
            message: '封面图不超过2M，仅支持jpg、png、jpeg格式'
          })
          var jqObj = JQ("#uploadInput");
          jqObj.val("");
          var domObj = jqObj[0];
          domObj.outerHTML = domObj.outerHTML;
          var newJqObj = jqObj.clone();
          jqObj.before(newJqObj);
          jqObj.remove();
          JQ("#uploadInput").unbind().change(function (e) {
            that.coverImgChang(e);
          });
          return;
        }
        reader.onload = function (e) {
          that.checkedImg = reader.result;
        }
        reader.readAsDataURL(fileList)
        // this.$refs.cropper.reload()
        this.vIf = true;
      },
      handleImgAddrHandle(data) {
        return handleImgAddr(data, 1)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'
  @import '../../assets/stylus/personalModal.styl'

  .avatarModal
    .el-dialog
      width 520px
      height 561px
    .el-dialog__header
      border-bottom $border
    .el-dialog--center .el-dialog__body
      padding 0px
    .modal-foot-btn
      border-top $border
      padding-top 30px
      margin-top 58px

  .wrapper {
    width 280px
    height 280px
    display inline-block
    float left
    margin 30px 50px
    margin-bottom 0px
  }

  .previewContainer
    display inline-block
    margin-top 30px
    p
      margin 16px 0px
      text-align center
      color #9B9B9B
      font-size 14px
    p:nth-child(1)
      margin-top 0px

  .img120, .img70, .img30
    display block;
    border-radius 50%;
    margin 0px auto;

  .img120
    width 90px
    height 90px

  .img70
    width 50px
    height 50px

  .img30
    width 30px
    height 30px

  .uploadbtn
    width 70px
    height 20px
    overflow hidden
    position absolute
    top 400px
    left 50px
    cursor pointer

  .warningTil
    display block
    margin 8px 0px
    margin-top -54px
    margin-left 50px
    font-size 14px
    color #666

  .uploadbtn button
    position absolute
    top 0px
    z-index 1
    border 0px
    background #fff
    color #2382EA
    cursor pointer
    padding 0px

  .uploadbtn input
    opacity 0
    position absolute
    z-index 2
    cursor pointer

  .previewImgContainer
    position relative
    background rgba(0, 0, 0, 0.1)
    overflow hidden
    img
      position absolute
      top 0px
      bottom 0px
      left 0px
      right 0px
      margin auto
      max-width 100%
</style>
