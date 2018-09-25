<template>
      <div class="baseBox pl20">
              <!-- 组织 -->
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
                    <div class ='info_id_card'>
                      <img src = "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18041801/licensePic.png"/>
                     <p class = 'info_id_card_p'>
                        <span>组织机构代码扫描件</span>
                        <span>已通过审核</span>
                      </p>
                    </div>
                </el-form-item>
                <el-form-item label="管理员真实姓名"  v-if = "personInfo.realName !=null && personInfo.realName != ''">
                     <span>{{personInfo.realName}}</span>
                </el-form-item>
                <el-form-item label="管理员身份证号"  v-if = "personInfo.idcard !=null && personInfo.idcard != ''">
                      <span>{{personInfo.idcard}}</span>
                </el-form-item>
                <el-form-item label="管理员身份证扫描件"   v-if = "personInfo.idcardBack != null || personInfo.idcardFront != null || personInfo.idcardPic != null">
                    <div class ='info_id_card'>
                      <img src = "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18041801/idcard.png"/>
                        <p class = 'info_id_card_p'>
                        <span>身份证正面扫描件</span>
                        <span>已通过审核</span>
                      </p>
                    </div>
                </el-form-item>
                 <el-form-item label="相关网站链接"  v-if = "personInfo.siteLink !=null && personInfo.siteLink != ''">
                    <span>{{personInfo.siteLink}}</span>
                </el-form-item>
                <el-form-item label="其他资质"  v-if = "personInfo.otherPic !=null && personInfo.otherPic != ''">
                    <span>您上传的各类资质已通过审核</span>
                </el-form-item>
              </el-form>
      </div>
</template>

<script>



export default {
  components: {
  },
  props: {
    personInfo: {}
  },
  data () {
    return {
      imgUrl:''
      }
  },
  mounted(){

  },
  methods: {

    },
  }
</script>

<style scoped>
</style>
