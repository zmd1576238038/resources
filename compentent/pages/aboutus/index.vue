/*
 * @Description: 关于我们
 * @Author: zhangchenle
 * @Date: 2018-06-15 22:20:12
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-24 18:21:01
 */
<template>
	<div id="app" class ='aboutContainer' >
    <about-nav :index="0"></about-nav>
    <div class ='aboutMain'>
      <div class ='aboutTit'>
        <i></i>
        <h1>千氪财经简介</h1>
      </div>
      <p class ='aboutInfo'>1.千氪财经正式创办于2018年3月，是中国一家具有国际视野的财经网站，将打造专业、权威、以用户为中心的财经媒体。我们致力于数据挖掘的推荐引擎产品，为用户推荐信息，提供连接人与金融信息及金融服务的产品，为广大投资者提供不同种类的最新行业资讯。我们将邀请各大领域的专家，借助他们对于各自领域的深刻认识，构建一个覆盖面广，同时不断更新的资讯库；同时开创区块链SAAS创新创业生态服务平台。</p>
      <p class ='aboutInfo'>2.围绕这一理念，千氪财经传媒的报道方向从“区块链+互联网+新经济”向“新经济”全面升级，致力于报道能代表未来经济趋势的新商业公司。而背后三大动力，一个是新兴的区块链技术，一个是以移动互联网、人工智能为代表的“科技”，一个以创业融资为代表的“资本”，千氪财经将以此作为切入点，来报道和深度服务这些能代表未来经济趋势的新商业公司，以及各行业的最近动态。</p>
      <p class ='aboutInfo'>3.在信息爆炸的时代，人们面对的选择越来越多，而选择过多，信息超载，也常常会使人无所适从。在这种情况下，推荐引擎便开始展现技术优势，发挥威力。千氪财经就是一款基于数据挖掘的推荐引擎产品，它不是传统意义上的新闻客户端，算法模型会记录用户在千氪财经上的每一次行为，在海量的资讯里精准了解你感兴趣的内容，甚至知道你有可能感兴趣的内容，并将它们精准推送给你。</p>
    </div>
	</div>
</template>

<script>
import AboutNav from '@/components/About/AboutNav';

export default {
  components: { AboutNav },
  head:{
    title:'关于我们-千氪'
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

#app
  margin-bottom 60px
  .aboutMain
    margin-bottom 60px
    width: 1098px
    margin: 0 auto
    background: #fff
    min-height: 600px
    padding: 50px 66px 66px
    .aboutTit
      display flex
      flex-direction row
      margin-top 15px
      i
        display inline-block
        width 8px
        height 8px
        background-color rgba(29, 135, 255, 1)
        margin-top 15px
        margin-right 20px
      h1
        font-size 24px
        color #444
        width 914px
        line-height 36px
    .aboutInfo
      font-size 16px
      color #999
      margin-left 30px
      width 914px
      line-height 28px
      margin-top 15px
</style>
