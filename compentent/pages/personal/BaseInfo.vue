/*
* @Description: 个人中心页
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <section class='base-info'>
    <el-form ref="infoForm" :rules="rules" :model="baseInfo" label-width="110px" v-if="baseInfoVisible == 1">
      <el-form-item label="昵称" prop='userName'>
        <el-input v-model="baseInfo.userName" type="text" class="nickname"></el-input>
      </el-form-item>
      <el-form-item label="所在地区" style="width:600px">
        <no-ssr>
          <v-distpicker
            :province="baseInfo.province"
            :city="baseInfo.city"
            :area="baseInfo.county"
            @selected="selected"
            @city="selectCity"
            @province="selectProvince"
            @area="selectArea"
            class='distpicker'></v-distpicker>
        </no-ssr>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="radio" label="1">男</el-radio>
        <el-radio v-model="radio" label="0">女</el-radio>
      </el-form-item>
      <el-form-item label="个人简介" prop='resume'>
        <el-input v-model="baseInfo.resume" type="textarea" class="offer"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" class="save" @click="save('infoForm')">保存</el-button>
      </el-form-item>
    </el-form>
    <!-- 个人 -->
    <person-info class="form-info" :personInfo="baseInfo" v-else-if="baseInfoVisible == 2"/>
    <!-- 媒体 -->
    <media-info class="form-info" :personInfo="baseInfo" v-else-if="baseInfoVisible == 3"/>
    <!-- 公司 -->
    <company-info class="form-info" :personInfo="baseInfo" v-else-if="baseInfoVisible == 4"/>
    <!-- 组织 -->
    <org-info class="form-info" :personInfo="baseInfo" v-else-if="baseInfoVisible == 5"/>
    <section class="roleName" v-if="baseInfoVisible != 1 && baseInfoVisible != 0">
      <span class="role">当前角色：</span>
      <span class="role-content">
          <svg-icon v-if="baseInfoVisible == 2" iconClass="person" class="icon-client"></svg-icon>
          <svg-icon v-else-if="baseInfoVisible == 3" iconClass="association" class="icon-client"></svg-icon>
          <svg-icon v-else-if="baseInfoVisible == 4" iconClass="media" class="icon-client"></svg-icon>
          <svg-icon v-else-if="baseInfoVisible == 5" iconClass="company" class="icon-client"></svg-icon>
          <span v-if="baseInfoVisible == 2" class="name">个人</span>
          <span v-else-if="baseInfoVisible == 3" class="name">媒体</span>
          <span v-else-if="baseInfoVisible == 4" class="name">企业</span>
          <span v-else-if="baseInfoVisible == 5" class="name">组织</span>
        </span>
    </section>
    <!-- <v-cropper :visible="avatarVisible"></v-cropper> -->
  </section>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import axios from '@/plugins/axios'
  import {mapState} from 'vuex'
  import {handleImgAddr} from '@/utils/utils'
  import V from '@/utils/verification'
  import PersonInfo from './PersonInfo';
  import MediaInfo from './MediaInfo';
  import CompanyInfo from './CompanyInfo';
  import OrgInfo from './OrgInfo';
  import SvgIcon from '@/components/base/SvgIcon/SvgIcon'

  export default {
    data() {
      let validateName = (rule, value, callback) => {
        if (value.replace(/(^\s*)|(\s*$)/g, "") == '') {
          callback(new Error('请输入昵称'));
        } else if (!(V.checkLength(value))) {
          callback(new Error('请输入15个字以内的昵称'));
        } else if(value.length > 15){
          callback(new Error('请输入15个字以内的昵称'))
        } else {
          callback();
        }
      }
      let validateResume = (rule, value, callback) => {
        if (value != '' && value != null && (value.length > 100 || value.length < 10)) {
          callback(new Error('请输入10-100字以内的个人简介'));
        } else {
          callback();
        }
      }
      return {
        rules: {
          userName: [{
            validator: validateName, trigger: 'blur'
          }],
          resume: [{
            validator: validateResume, trigger: 'blur'
          }]
        },
        baseInfo: {
          "userName": '',
          "resume": ''
        },
        radio: '',
        avatarVisible: false,
        isFalse: false,
        baseInfoVisible: 0,
        allSelect: true,
        defaultProvince: '',
      }
    },
    beforeCreate() {
      if (process.browser) {
        const Distpicker = require('v-distpicker')
        Vue.use(Distpicker)
        Vue.component('v-distpicker', Distpicker)
      }
    },
    props: {},
    computed: {
      ...mapState([
        'KGUser',
        'personalBaseInfo'
      ])
    },
    components: {
      PersonInfo, MediaInfo, CompanyInfo, OrgInfo, SvgIcon
    },
    mounted() {
      this.getBaseInfo()
    },
    methods: {
      save(formName) {
        const that = this;
        const roleId = this.baseInfo.userRole;
        // if (!this.allSelect && this.defaultProvince != '') {
        //   this.$message({
        //     type: "warning",
        //     message: '请选择完整的家乡地址'
        //   })
        //   return
        // }
        if(!this.baseInfo.province || (this.baseInfo.province && this.baseInfo.province === '省')){
          this.$message({type:'warning',message:'请选择省'})
          return
        }
        if(!this.baseInfo.city || (this.baseInfo.city && this.baseInfo.city === '市')){
          this.$message({type:'warning',message:'请选择市'})
          return
        }
        if(!this.baseInfo.county || (this.baseInfo.county && this.baseInfo.county === '区')){
          this.$message({type:'warning',message:'请选择区'})
          return
        }

        const list = {
          "roleId": roleId,
          "userId": this.KGUser.userId,
          "sex": this.radio,
          "country": this.baseInfo.country,
          "province": this.baseInfo.province,
          "city": this.baseInfo.city,
          "county": this.baseInfo.county,
          "resume": this.baseInfo.resume,
          "userName": this.baseInfo.userName,
        }
        //更改个人基本信息
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ajax({
              url: '/userprofile/updateProfile',
              data: list,
              headers: {
                token: that.KGUser.token
              },
              success: (res) => {
                if (res.code == 10000) {
                  localStorage.setItem('kg_desk_userName', that.baseInfo.userName);
                  that.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  setTimeout(() => {
                    location.reload()
                  }, 200);
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
      selected(value) {
        // this.baseInfo.province = value.province.value
        // this.baseInfo.city = value.city.value
        // this.baseInfo.county = value.area.value
        // this.allSelect = true;
      },
      selectProvince(value) {
        this.baseInfo.province = value.value
      },
      selectArea(value) {
        this.baseInfo.county = value.value
      },
      selectCity(value) {
        this.baseInfo.city = value.value
      },
      getBaseInfo() {
        const that = this;
        this.ajax({
          url: '/userprofile/getProfile',
          data: {
            userId: that.KGUser.userId
          },
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            res = res.responseBody.data
            that.baseInfo = res;
            that.radio = res.sex;
            switch (res.userRole) {
              case null:
                that.baseInfoVisible = 1;
                break;
              case '1':
                that.baseInfoVisible = 1;
                break;
              case '2':
                that.baseInfoVisible = 2;
                break;
              case '3':
                that.baseInfoVisible = 3;
                break;
              case '4':
                that.baseInfoVisible = 4;
                break;
              case '5':
                that.baseInfoVisible = 5;
                break;
              default:
            }
          }
        })
      },
      handleImgAddress(imgAddr) {
        return handleImgAddr(imgAddr)
      },
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'
  .base-info
    padding 57px 0px
    position relative
    background-color #fff
    .roleName
      position absolute
      right 30px
      top 20px
      display flex
      flex-direction row
      .role-content
        display flex
      .role
        font-size 14px
        color #666
      .icon-client, .name
        color #2382EA
        font-size 14px
      .icon-client
        margin -5px 10px 0px 5px
    .el-form
      width 580px
      margin 0 auto
    .el-input__inner, .el-textarea__inner
      width 410px
      border-radius 0px
    .info-avatar
      display inline-block
      width 100px
      height 100px
    .avatar-limit
      font-size 12px
      color #666
      margin-left 14px
    .fix-avatar
      width 100px
      height 28px
      padding 0px
      border-radius 0px
      background #2382ea
    .save
      width 170px
      height 40px
      background #2382ea
      border-radius 0px
    .form-info
      .el-form
        width auto
        padding-left 100px
        .el-form-item__label
          text-align left
</style>
