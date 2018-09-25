<template>
  <div class="baseBox">
    <!-- 个人 -->
    <el-form ref="form" label-width="110px">
      <el-form-item label="专栏名称">
        <span>{{personInfo.columnName}}</span>
      </el-form-item>
      <el-form-item label="专栏介绍">
        <span>{{personInfo.columnIntro}}</span>
      </el-form-item>
      <el-form-item label="所在地区">
        <span>{{personInfo.columnProvince}}{{personInfo.columnCity}} </span>
      </el-form-item>
      <el-form-item label="真实姓名" v-if="personInfo.realName !=null && personInfo.realName != ''">
        <span>{{personInfo.realName}}</span>
      </el-form-item>
      <el-form-item label="身份证号" v-if="personInfo.idcard !=null && personInfo.idcard != ''">
        <span>{{personInfo.idcard}}</span>
      </el-form-item>
      <el-form-item label="身份证扫描件"
                    v-if="personInfo.idcardBack != null || personInfo.idcardFront != null || personInfo.idcardPic != null">
        <div class='info_id_card'>
          <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18041801/idcard.png"/>
          <p class='info_id_card_p'>
            <span>身份证扫描件</span>
            <span>已通过审核</span>
          </p>
        </div>
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
    data() {
      return {
        imgUrl: ''
      }
    },
    methods: {},

    mounted() {
    },

  }
</script>

<style scoped>
  /*   .info_id_card{
    display: inline-block;
    position: relative;
    width:200px;
    height:130px;
  }
  .info_id_card img{
    display: inline-block;
    width:100%;
    height:100%;
  }
  .info_id_card span{
    display: inline-block;
    position: absolute;
    z-index: 100;
    width:100%;
    height:100%;
    line-height: 130px;
    text-align: center;
    background:rgba(0,0,0,0.7);
    top:0px;
    color:#fff;
  } */
</style>
<style>
  .info_id_card {
    display: inline-block;
    position: relative;
    width: 200px;
    height: 130px;
  }

  .info_id_card img {
    display: inline-block;
    width: 100%;
    height: 100%;
    border: 4px;
  }

  .admin_card {
    margin-right: 8px;
  }

  .info_id_card_p {
    /*display: inline-block;*/
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100%;
    line-height: 130px;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    top: 0px;
    color: #fff;
    left: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 4px;
  }

  .info_id_card_p span {
    line-height: 20px;
  }
</style>
