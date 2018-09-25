<template>
      <div class="baseBox pl20">
              <!-- 企业 -->
              <el-form ref="form" label-width="150px">
                <el-form-item label="专栏名称">
                  <span>{{personInfo.columnName}}</span>
                </el-form-item>
                <el-form-item label="专栏介绍">
                    <span>{{personInfo.columnIntro}}</span>
                </el-form-item>
                <el-form-item label="所在地区">
                     <span>{{personInfo.columnProvince}}{{personInfo.columnCity}}</span>
                </el-form-item>
                  <el-form-item label="企业名称">
                     <span>{{personInfo.companyName}}</span>
                </el-form-item>
                  <el-form-item label="企业营业执照扫描件">
                    <div class ='info_id_card'>
                      <!-- <img :src = "imgUrl + personInfo.licensePic"/> -->
                      <img src = "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18041801/licensePic.png"/>

                      <p class = 'info_id_card_p'>
                        <span>组织机构代码扫描件</span>
                        <span>已通过审核</span>
                      </p>
                    </div>
                </el-form-item>
                <el-form-item label="管理员真实姓名" v-if = "personInfo.realName !=null && personInfo.realName != ''">
                     <span>{{personInfo.realName}}</span>
                </el-form-item>
                <el-form-item label="管理员身份证号" v-if = "personInfo.idcard !=null && personInfo.idcard != ''">
                      <span>{{personInfo.idcard}}</span>
                </el-form-item>
                <el-form-item label="管理员身份证扫描件"   v-if = "personInfo.idcardBack != null || personInfo.idcardFront != null || personInfo.idcardPic != null">
                  <div class ='info_id_card'>
                      <img src = "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/18041801/idcard.png"/>
                      <p class = 'info_id_card_p'>
                        <span>身份证扫描件</span>
                        <span>已通过审核</span>
                      </p>
                    </div>
                </el-form-item>
                 <el-form-item label="相关网站链接" v-if = "personInfo.siteLink !=null && personInfo.siteLink != ''">
                    <span>{{personInfo.siteLink}}</span>
                </el-form-item>
                <el-form-item label="其他资质" v-if = "personInfo.otherPic !=null && personInfo.otherPic != ''">
                <span>您上传的各类资质已通过审核</span>
                </el-form-item>
                <el-form-item>
                     <a class="comprules" @click="showRulesBox">企业账号降级及保证金退回规则</a><i class="el-icon-question"></i>
                </el-form-item>
              </el-form>
              <el-dialog
                class = 'safeModal'
                title="企业账号降级及保证金退回规则"
                :visible="newRules"
                :before-close="beforeClose"
				center
                >
                <div  class="forGetBox">
                  <h1 class="title font16">降级规则</h1>
				  	<div>
						<p class="f1">一、定义</p>
						<p>1.企业账号降级：指当前用户角色为企业的用户账号，可向千氪财经平台发送申请降级邮件，通过审核后，该账号的角色会变更为普通用户的过程，被称为企业账号降级。</p>
					</div>
					<div>
						<p class="f1">二、申请降级的条件</p>
						<p>1.用户角色：只有用户角色为企业的账号，才能申请降级；</p>
						<p>2.文章的阅读奖励规则：当您申请企业账号降级时，需确认自己发布的文章中是否还有已生效状态的阅读奖励，如果有，则申请不会被审核通过。</p>
					</div>
					<div>
						<p class="f1">三、如何申请降级？</p>
						<p>1.进入个人中心-账号与安全页，切换到“基本资料”下，页面滑动到底部，点击“企业账号降级及保证金退回规则”</p>
						<p>2.在弹框中找到，您会看到降级申请需发送的邮箱地址。</p>
						<p>3.降级申请联系邮箱：<span class="email">support@kg.com。</span></p>
						<p>4.邮件中必须包含的信息有：注册手机号、企业名称、企业营业执照扫描件、申请人姓名、所在职位、联系电话、申请降级原因。这些信息务必填写清楚，否则申请将不会审核通过。</p>
					</div>
					<div>
						<p class="f1">四、申请后需要做什么？</p>
						<p>1.申请降级邮件发送成功后，1-5个工作日内，会有工作人员电话或邮件联系您确认相关信息。</p>
						<p>2.信息确认无误后，1个工作日内，千氪财经平台会将您的企业账号降级为普通用户</p>
					</div>
					<div>
						<p class="f1">五、账号降级后有什么影响?</p>
						<p>1.成功降级为普通用户后，您需要重新登录千氪财经网站、APP、移动端网页；</p>
						<p>2.之前以企业角色发布的所有文章，您将无法在个人中心-我的专栏列表中看到，无法做文章相关的任何操作。但您之前发布的所有文章，系统不会删除。当您再次申请专栏成功后，之前发布的所有文章，会再次展示在个人中心-我的专栏列表中。</p>
						<p>3.以普通用户身份登录后，除个人中心-发布文章功能无法使用，且发布功能被隐藏外，其他任何操作均不受影响。</p>
						<p>4.账号被成功降级后，您仍然可以继续申请专栏权限，个人、媒体、企业、组织四种角色均可选择申请。</p>
					</div>
					<h1 class="title font16">企业账号保证金缴纳与退回规则</h1>
					<div>
						<p class="f1">一、定义</p>
						<p>1.企业账号保证金（本文档以下都简称为“保证金”）：指用户在申请千氪财经企业专栏账号时，需缴纳一定数额的钛值作为账号保证金。</p>
					</div>
					<div>
						<p class="f1">二、保证金的缴纳要求</p>
						<p>1.缴纳数额：100000钛值（TV）</p>
						<p>2.缴纳时机：在您成功提交企业专栏申请后，按照页面提示的缴纳地址，向该地址转账100000TV的钛值。</p>
					</div>
					<div>
						<p class="f1">三、缴纳保证金的目的</p>
						<p>千氪财经为保证所有读者的阅读权益，提供有质量的资讯内容，特推出企业账号保证金制度，以防止各企业账号滥用文章发布权力，降低资讯内容质量，损害千氪财经读者权益。</p>
					</div>
					<div>
						<p class="f1">四、保证金的用途</p>
						<p>根据缴纳保证金的目的，在企业账号出现违反《千氪财经专栏申请协议》的情况时，千氪财经有权对该账号的保证金做扣押处理或不受理保证金退回申请。</p>
					</div>
					<div>
						<p class="f1">五、保证金的退回</p>
						<p>1.何时退回：当缴纳过保证金的企业账号向千氪财经平台发出账号降级申请邮件，经过平台方审核通过并进行了降级处理后，工作人员会电话联系对应用户，确认保证金转账地址，并进行转账处理。</p>
						<p>2.退回数额：经千氪财经平台审核后，对应企业账号未出现违反《千氪财经专栏申请协议》的情况，将全额退回所有保证金至用户提供的转账地址中。</p>
					</div>
					<p class="f2">本规则最终解释权归千氪财经所有</p>
                </div>
              </el-dialog>
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
      imgUrl: '',
      newRules: false
    };
  },
  mounted() {},
  methods: {
	  showRulesBox(){
		  var _this =this;
		  _this.newRules =true;
	  },
	  beforeClose(){
		   var _this =this;
		  _this.newRules =false;
	  }
  }
};
</script>

<style scoped>
.comprules {
  text-align: center;
  color: #666 !important;
  font-size: 12px !important;
  cursor: pointer;
}
.comprules:hover {
  color: #1d87ff !important;
}
.forGetBox{
	height:600px;
	overflow:auto;
}
.forGetBox p{
	margin-top: 10px;
}
.forGetBox h1{
	margin-top: 16px;
}
.f1{
	color:#606266;
}
.f2{
	color:#666;
	/* font-size:12px!important; */
}
.email{
	color: #1d87ff !important;
}
</style>
