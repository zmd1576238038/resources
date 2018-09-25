/*
 * @Description: 列表二级页面
 * @Author: LiuZhen
 * @Date: 2018-06-10 22:20:12
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-23 16:45:10
 */
<template>
  <section class="list-container">
    <header class="list-header">
      <img :src="bannerUrl.url" alt="banner">
      <div class="banner-info">
        <p class="banner-title">{{bannerUrl.title}}</p>
        <p class="banner-tips">{{bannerUrl.tips}}</p>
      </div>
    </header>
    <main class="list-content">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col style="width: 960px">
          <section class="list-content-main">
            <column-list isColumn="true" :isShipin="isShipin" :activeIndex="activeIndex" :indexTabList="list" @loadingMore="loadingMore"></column-list>
          </section>
        </el-col>
        <el-col style="width: 300px">
          <section class="list-content-aside">
            <list-container :activeTabName="tabname">
              <list-hot-article v-if="tabname==='热门文章'" :hotArticleList="hotArticleList"></list-hot-article>
              <div style="padding: 15px;background-color: #fff">
                <hot-video-list v-if="tabname==='热门视频'" :hotVideoList="hotVideoList"></hot-video-list>
              </div>
            </list-container>
          </section>
          <!--广告位置-->
          <section class="list-advert" v-if="advertsList[0] && item.imagePos == 21"
                   v-for="(item,index) in  advertsList" :key="index">
            <img @click="toAddress(item)" :src="handleImgAddrHandle(item.imageAddress,1,item)"/>
            <p v-if="item.imageType===1" class="article-title">{{item.articleTitle}}</p>
            <img class="adver-tips" v-if="item.imageType===2" src="@/assets/img/adver.png" alt="广告">
          </section>
        </el-col>
      </el-row>
    </main>
  </section>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import ColumnList from '@/components/IndexList/ColumnList'
import { handleRequestParams, handleImgAddr } from '@/utils/utils'
import ListContainer from '@/components/ListContainer/ListContainer'
import ListHotArticle from '@/components/ListHotArticle/ListHotArticle'
import HotVideoList from '@/components/HotVideoList/HotVideoList'
import columnConfig from '@/utils/columnConfig'

export default {
  name: 'NavColumnList',
  data () {
    return {
      bannerUrl: '',
      isShipin: false, // 是否为视屏栏目
      activeIndex: 0, // 激活的tab页下标
      list: [], // tab页数据(包括页码,栏目名称)
      hotArticleList: [],   // 热门文章
      hotVideoList: [], //热门视频
      advertsList: [],
      tdkTitle:'',
      tdkKeywords:'',
      tdkDescription:'',
      tabname:'热门文章'
    }
  },
  head(){
    return {
      title:this.tdkTitle,
      meta: [
        {hid: 'keywords', name: 'keywords', content: this.tdkKeywords},
        {hid: 'description', name: 'description', content: this.tdkDescription}
      ],
    }
  },
  created(){
    let id = this.$route.params.id
    let list = columnConfig.config[columnConfig.mapping[id]] // 获取tab列表配置数据
    list.map((item, index)=> {
      if(id === item.type) this.activeIndex = index
    })
    const twoLevel = columnConfig.mapping[id]
    if(twoLevel === 'jinrong'){
      this.tdkTitle = '股票期货_宏观经济_新经济_外汇_金融行业分析-千氪'
      this.tdkKeywords = '股票期货,新经济,宏观经济,外汇,商业产经,财经政策'
      this.tdkDescription = '千氪金融栏目包含宏观经济、股票期货、外汇风向、商业产经、行情分析、政策一览等模块，主要为您提供最新金融财经动向、专业财经分析点评及相关财经政策，轻松理财投资'
    }else if(twoLevel === 'keji'){
      this.tdkTitle = '区块链_区块链是什么_人工智能AI_大数据_物联网技术行业动向-千氪'
      this.tdkKeywords = '区块链,大数据，物联网,人工智能,AI,数字货币'
      this.tdkDescription = '千氪科技频道包含区块链、科技动态、百家观点、行业动向、技术动态等模块，主要为您提供区块链、大数据、物联网、人工智能、AI等新兴互联网行业动态，专家观点，及最新技术趋势，让你从根本上掌握互联网科技最新资讯'
    }else if(twoLevel === 'keshipin'){
      this.tabname = '热门视频'
      this.tdkTitle = '科技视频_财经视频_股票视频_新闻视频-千氪财经'
      this.tdkKeywords = '科技,财经,股票期货,区块链,数字货币'
      this.tdkDescription = '千氪视频栏目，主要为您提供最新互联网科技视频、股票期货视频、金融财经视频、新闻播报、科普视频等等，让您更直观的掌握最新金融科技讯息'
    }else if(twoLevel === 'dujia'){
      this.tdkTitle = '区块链资讯_人工智能AI_股票期货_金融财经独家资讯-千氪'
      this.tdkKeywords = '区块链资讯,人工智能资讯,股票期货,独家资讯'
      this.tdkDescription = '千氪独家栏目包含千氪朝文、千氪报道、千氪专访、千氪速递、千氪观点等特色栏目版块，为您提供区块链、人工智能、大数据、物联网、股票期货、金融财经等最新独家资讯，轻松get当下原创高价值金融科技讯息'
    }else if(twoLevel === 'huodong'){
      this.tdkTitle = '线上活动_线下活动_千氪活动-千氪'
      this.tdkKeywords = '线上活动,线下活动,千氪活动'
      this.tdkDescription = '千氪活动栏目主要包含线上活动和线下活动两个板块，主要为您分享千氪最新线上、线下活动及相关活动细则，轻松参与活动，赢取大奖'
    }else if(twoLevel === 'tupian'){
      this.tdkTitle = '图片-千氪'
      this.tdkKeywords = '千氪,千氪财经,区块链,数字货币,金融,财经,外汇,期货,基金,股票,人工智能,AI,大数据,物联网'
      this.tdkDescription = '千氪财经（Kg.com），新兴金融科技媒体服务平台，提供7*24小时全天候金融财经科技资讯，包括区块链、人工智能AI、物联网、大数据、数字货币、股票、期货、基金、新金融、新经济、商业等行业及时权威的要闻推送，并为用户提供一站式金融投资和理财交流服务'
    }else if(twoLevel === 'gonggao'){
      this.tdkTitle = '公告-千氪'
      this.tdkKeywords = '千氪,千氪财经,区块链,数字货币,金融,财经,外汇,期货,基金,股票,人工智能,AI,大数据,物联网'
      this.tdkDescription = '千氪财经（Kg.com），新兴金融科技媒体服务平台，提供7*24小时全天候金融财经科技资讯，包括区块链、人工智能AI、物联网、大数据、数字货币、股票、期货、基金、新金融、新经济、商业等行业及时权威的要闻推送，并为用户提供一站式金融投资和理财交流服务'
    }
  },

  async asyncData ({ store, redirect, error, route }) {
    let id = route.params.id
    let url = '/article/getChannelArt'
    let asyncData = {list: []}
    if(id === 'keshipin') asyncData.isShipin = true
    else asyncData.isShipin = false

    let list = columnConfig.config[columnConfig.mapping[id]] || [] // 获取tab列表配置数据
    asyncData.bannerUrl = columnConfig.bannerConfig[columnConfig.mapping[id]] // 获取banner图地址
    let promiseList = []
    list && list.map((item, index)=> {
      promiseList.push(axios.post(url, { "columnId": item.columnId, "currentPage":1 }))
    })
    if(asyncData.isShipin){
      promiseList.push(axios.post('/video/hotVideoList', {}))//热门视频
    }else {
      promiseList.push(axios.post('/article/selecttoparticle', {"currentPage":1})) // 热门文章列表数据
    }
    promiseList.push(axios.post('/siteimageapi/listsiteimage', {"navigator_pos": 2}))//广告
    let results = await Promise.all(promiseList)

    // 设置tab页数据
    list && list.map((item, index) => {
      let result = results[index]
      let obj = {
        columnId: item.columnId,
        columnName: item.columnName,
        totalPage: 0,
        currentPage: 1,
        data: []
      }
      if(result.data.code === '10000') {
        let info = result.data.responseBody
        obj = Object.assign(obj, {
          totalPage: info.totalPage,
          currentPage: info.currentPage,
          data: info.data || []
        })
      }
      asyncData.list.push(obj)
    })
    // 设置热门文章/热门视频数据
    if(asyncData.isShipin){
      let hotVideoList = results[results.length - 2].data
      asyncData.hotVideoList = hotVideoList.code === '10000' ? hotVideoList.responseBody : []
    }else {
      let hotArticleList = results[results.length - 2].data
      asyncData.hotArticleList = hotArticleList.code === '10000' ? hotArticleList.responseBody : []
    }
    // 设置广告
    let adverts = results[results.length-1].data.responseBody
    const newList = [];
    if (adverts && adverts.length != 0) {
      for (var i in adverts) {
        if (adverts[i].imagePos == 21) {
          newList.push(adverts[i])
        }
      }
    }
    asyncData.advertsList = newList.splice(0,1)
    return asyncData
  },
  methods: {
    toAddress(item) {
      if (item.imageType == 1) {
        if(item.articleType===1){
          window.open('/article/' + item.articleId)
        }else {
          window.open('/video/' + item.articleId)
        }
      } else {
        window.open(item.imageDetail);
      }
    },
    handleImgAddrHandle(data, type,item) {
      if (type) {
        return handleImgAddr(data, 1)
      } else {
        return handleImgAddr(data)
      }
    },
    loadingMore (index) {
      let url = '/article/getChannelArt'
      try {
        let item = this.list[index]
        let params = {
          "columnId": item.columnId,
          "currentPage": ++item.currentPage
        }
        Promise.resolve(axios.post(url, params))
        .then(({ data }) => {
          if(data.code === '10000') {
            let info = data.responseBody
            item.totalPage = info.totalPage
            item.currentPage = info.currentPage
            item.data = item.data.concat(info.data || [])
          }
        })
      } catch (e) {
        throw new Error(e)
        // console.log(e);
      }


      // data.forEach((item, index) => {
      //   if (item.type === type) {
      //     params = handleRequestParams({"columnId":item.columnId, "currentPage":this[item.pageNumName] + 1})
      //     reqUrl = `${api}/?${params}`

      //     try {
      //       Promise.resolve(axios.post(reqUrl))
      //       .then(({ data }) => {
      //         let tmpData = data.responseBody.data
      //           this[item.listName] = tmpData.reduce((coll, item) => {
      //             coll.push(item)
      //             return coll
      //           }, this[item.listName])

      //           this[item.pageNumName] += 1
      //       })
      //     } catch (e) {
      //       throw new Error(e)
      //     }
      //   }
      // })
    }
  },

  components: {
    ColumnList,
    ListContainer,
    ListHotArticle,
    HotVideoList
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.list-container
  width 100%
  .list-header
    width 100%
    max-width 1920px
    height 150px
    overflow hidden
    background-color #333
    position relative
    img
      width 100%
    .banner-info
      position absolute
      color #fff
      transform translate(-50%,-50%)
      left 50%
      top 50%
      text-align center
      .banner-title
        font-size 40px !important
        margin-bottom 27px
        letter-spacing 1em
        text-indent: 1em
        text-align center
      .banner-tips
        font-size 14px
        letter-spacing 5px
        text-indent 5px
        text-align center

  .list-content
    width 1260px
    margin 30px auto
    display run-in
    .list-content-main
      width 944px
      margin-right 16px
    .list-content-aside
      width 300px
  .list-advert
    width 300px
    overflow hidden
    position relative
    .adver-tips
      position absolute
      width 32px
      height 21px
      bottom 5px
      right 5px
    img
      width 100%
      cursor pointer
    .article-title
      padding 5px
      position absolute
      bottom 3px
      font-size 14px
      color #fff
      line-height 22px
      word-break break-all
      background-image: linear-gradient(0deg, #000, transparent)
      no-wrap(2)
  .tagBanner {
    width: 100%;
    height: 21vw;
    background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/tagbanner.png')
    background-size: contain;
    background-repeat: no-repeat;
  }

  .tagInfo {
    font-family: MicrosoftYaHei;
    width: 1260px;
    margin: 0 auto;
    margin-top: 20px;

    .tagDetail {
      position: relative;
      padding: 19px 60px 41px 228px;
      background-color: #fff;

      p:nth-child(1) {
        font-size: 16px;
        color: #333;

        span {
          padding: 5px 6px 5px 7px;
          color: #2382EA;
          font-size: 12px;
          background: rgba(236, 245, 255, 1);
          border-radius: 11px;
        }
      }

      p:nth-child(2) {
        width 508px
        font-size 12px
        line-height 20px
        color #666
        overflow hidden
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp: 2
        -webkit-box-orient vertical
        margin-top 16px
        min-height 33px
      }

      .baseData {
        float: right;
        margin-top: -51px;

        div {
          display: inline-flex;
          flex-direction: column;
          text-align: center;

          span:nth-child(2) {
            color: #9B9B9B;
            padding-top: 16px;
            font-size: 12px;
          }

          span:nth-child(1) {
            font-size: 18px;
            font-family: MicrosoftYaHei-Bold;
            font-weight: bold;
          }
        }

        div:nth-child(2) {
          margin: 0 44px 0 50px;
        }
      }

      img {
        position: absolute;
        left: 60px;
        top: -34px;
        border: 9px solid #EBEBEB;
        border-radius: 50%;
        width: 130px;
        height: 130px;
        z-index: 1;
      }
    }

    .tagArticle {
      margin-top: 30px;
      padding: 25px;
    }
  }
</style>
