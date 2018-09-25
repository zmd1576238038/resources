<template>
  <div class="baseBox pl20 media-person">
    <!-- 媒体 -->
    <el-form ref="form" label-width="150px">
      <el-form-item label="专栏名称">
        <span>{{personInfo.columnName}}</span>
      </el-form-item>
      <el-form-item label="专栏介绍">
        <span>{{personInfo.columnIntro}}</span>
      </el-form-item>
      <el-form-item label="所在地区">
        <span>{{personInfo.columnProvince}}{{personInfo.columnCity}} </span>
      </el-form-item>
      <el-form-item label="组织名称">
        <span>{{personInfo.companyName}}</span>
      </el-form-item>
      <el-form-item label="组织机构代码">
        <div class='info_id_card'>
          <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18041801/licensePic.png"/>
          <span class="access"></span>
        </div>
      </el-form-item>
      <el-form-item label="管理员真实姓名" v-if="personInfo.realName !=null && personInfo.realName != ''">
        <span>{{personInfo.realName}}</span>
      </el-form-item>
      <el-form-item label="管理员身份证号" v-if="personInfo.idcard !=null && personInfo.idcard != ''">
        <span>{{personInfo.idcard | cardId}}</span>
      </el-form-item>
      <el-form-item label="管理员身份证扫描件"
                    v-if="personInfo.idcardBack != null || personInfo.idcardFront != null || personInfo.idcardPic != null">
        <div class='info_id_card'>
          <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18041801/idcard.png"/>
          <p class='info_id_card_p'>
            <span>身份证扫描件</span>
            <span>已通过审核</span>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="相关网站链接" v-if="personInfo.siteLink !=null && personInfo.siteLink != ''">
        <span>{{personInfo.siteLink}}</span>
      </el-form-item>
      <el-form-item label="其他资质" v-if="personInfo.otherPic !=null && personInfo.otherPic != ''">
        <span>您上传的各类资质已通过审核</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      personInfo: {}
    },
    filters:{
      cardId(value){
        let reg = /^(.{3})(?:\d+)(.{2})$/
        let result = value.replace(reg,'$1**********$2')
        return result
      }
    },
    data() {
      return {
        imgUrl: ''
      }
    },
    mounted() {
      console.log(this.personInfo)
    },
    methods: {},
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .media-person
    .info_id_card
      display inline-block
      position:relative
      .access
        position absolute
        display inline-block
        width 20px
        height 20px
        background:rgba(60,188,152,1)
        border-radius 20px
        right -10px
        top -10px
        &:after
          content:''
          position absolute
          display inline-block
          width 5px
          height 10px
          border 1px solid #fff
          transform rotate(45deg)
          border-left none
          border-top none
          top: 3px
          left: 7px


</style>
