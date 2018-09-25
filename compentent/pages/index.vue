/*
 * @Description: 首页
 * @Author: LiuZhen
 * @Date: 2018-05-28 20:04:41
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-28 15:16:53
 */
<template>
  <main class="main" style="display: run-in">
    <section v-show="loadingFlag"><img src="../assets/img/loading-svg/loading.gif" alt="图片加载" style="height:100%;width:100%"></section>
    <!-- 轮播行情 -->
    <section class="index-full-broadcast">
      <broadcast-info :key="marketKey" :broadcaseData="marketData" showType="quotation" :broaddelay="100"></broadcast-info>
    </section>
    <!-- 轮播Banner -->
    <Carousel :bannerList="bannerList"></Carousel>
    <!-- 首页横屏广告位 -->
    <section class="index-full-banner" v-if="chkBannerLength(bannerList,12)">
      <picture-banner :bannerList="bannerList" :mostShowNum="1" :bannerPos="12"></picture-banner>
    </section>
    <!-- 快讯 -->
    <section class="index-full-broadcast">
      <broadcast-info :key="hoursKey" :broadcaseData="hoursData" :isTitle="true" :broaddelay="100" titleName="7X24小时快讯"></broadcast-info>
    </section>
    <!-- 主内容区域 -->
    <section class="index-list-container">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="12" class="index-left">
          <section class="index-info-list"  v-if="groupLists.length">
            <index-list
              activeName="最新资讯"
              :indexTabList="indexTabList"
              :groupLists="groupLists"
              @loadingMore="loadingMore"
              :articleIsEnd="articleIsEnd"
              :videoIsEnd="videoIsEnd" />
          </section>
        </el-col>
        <el-col :span="6" class="index-middle">
          <section class="index-hot-video-list">
            <list-container activeTabName="热门视频">
              <div class="hot-video-list-container">
                <hot-video-list :hotVideoList="hotVideoList"></hot-video-list>
              </div>
            </list-container>
          </section>

          <section class="index-banner-5" v-if="chkBannerLength(bannerList,13)">
            <picture-banner :bannerList="bannerList" :bannerPos="13" :mostShowNum="1"></picture-banner>
          </section>

          <section :class="['index-hot-article-list',hotfix?'fixed':'']" ref="hotArticleContent">
            <list-container activeTabName="热门文章">
              <list-hot-article :hotArticleList="hotArticleList"></list-hot-article>
            </list-container>
          </section>
        </el-col>
        <el-col :span="6" class="index-right">
          <section class="index-hot-column-list">
            <list-container activeTabName="热门专栏">
              <list-special-column :hotSpecialColumn="hotSpecialColumn"></list-special-column>
            </list-container>
          </section>
          <section class="index-banner-5" v-if="chkBannerLength(bannerList,15)">
            <picture-banner :bannerList="bannerList" :bannerPos="15"></picture-banner>
          </section>
          <!--<list-container activeTabName="百科词条" moreInfoUrl = "/baike" :showMore="true" >
            <Encyclopedia :encyclopediaList="encyclopediaList" maxShow="5"></Encyclopedia>
          </list-container>-->
          <list-container v-if="hotKeywordsList && hotKeywordsList.length>0" activeTabName="热门关键字" :moreInfoUrl = "hotKeyWords" :showMore="true">
            <hot-keywords :hotKeywordsList="hotKeywordsList"></hot-keywords>
          </list-container>
          <section class="index-banner-5" v-if="chkBannerLength(bannerList,16)">
            <picture-banner :bannerList="bannerList" :bannerPos="16"></picture-banner>
          </section>
        </el-col>
      </el-row>
    </section>
  </main>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import Carousel from '@/components/Carousel/Carousel'
import PictureBanner from '@/components/PictureBanner/PictureBanner'
import IndexList from '@/components/IndexList/IndexList'
import ListContainer from '@/components/ListContainer/ListContainer'
import HotVideoList from '@/components/HotVideoList/HotVideoList'
import ListSpecialColumn from '@/components/ListSpecialColumn/ListSpecialColumn'
import ListHotArticle from '@/components/ListHotArticle/ListHotArticle'
import Encyclopedia from '@/components/Encyclopedia/Encyclopedia'
import HotKeywords from '@/components/HotKeywords/HotKeywords'
import BroadcastInfo from '@/components/BroadcastInfo/BroadcastInfo'
import { handleRequestParams, handleWebStorage, judgeBrower } from '@/utils/utils'
import { WEBSOCKET_ADDRESS } from '@/config/config'

export default {
  name: 'Index',
  data () {
    return {
      bannerList: [],
      // searchBannerList: [],
      articleList: [],
      videoList: [],
      hotVideoList: [],
      hotSpecialColumn: [],
      hotArticleList: [],
      encyclopediaList: [],
      hotKeywordsList: [],
      groupLists: [],  // 传递到列表子组件中的组合好的列表数据
      indexTabList: ['最新资讯', '视频'],
      newsPageNum: 1,
      videoPageNum: 1,
      hoursData:[], // 新闻轮播数据
      hoursKey: 0,
      marketKey: 0,
      marketData: [],  // 行情轮播数据
      hotKeyWords: 'hotKeyWords',
      carouselList: [],   // 左右轮播banner广告数据
      articleIsEnd: true,
      videoIsEnd: true,
      hotfix:false,
      hoursSoket:'',
      marketSoket:'',
      loadingFlag:false   //添加页面加载动画
    }
  },

  async asyncData ({ store, redirect, error }) {
    console.log("======================开始进入node服务器首页=======================")
    console.log("======================接口调用api接口=======================")
    let [bannerList,
         // searchBannerList,
         articleList,
         videoList,
         hotVideoList,
         hotSpecialColumn,
         hotArticleList,
         encyclopediaList,
         hotKeywordsList,
         hoursData,
         marketData] = await Promise.all([
          axios.post('/siteimageapi/listsiteimage', { "navigator_pos":1 }),
          // axios.post('/siteimageapi/listsiteimage', { "navigator_pos":3 }),
          axios.post('/article/selectArticleAll', { "currentPage":1 }),   // 文章列表数据
          axios.post('/article/getVideoTabInfo', { "currentPage":1 }),      // 视频列表数据
          axios.post('/video/hotVideoList', {}),                          // 热门视频列表
          axios.post('/userprofile/getUserprofile', {"currentPage":1}),   // 热门专栏列表数据
          axios.post('/article/selecttoparticle', {}),                    // 热门文章列表数据
          axios.post('/article/encyclopediaList', {}),                    // 百科词条列表数据
          axios.post('/keywords/getkeywordsAll', {"secondChannel":0}),    // 热门关键字列表数据
          axios.post('/newsFlash/websocketNewsFlash', {}),                // 获取第一次的24小时新闻数据
          axios.post('/ticker/getTicker', {})                             // 获取第一次的行情轮播数据
      ])
      console.log("======================api接口调用完毕=======================")
      let articlePage = articleList.data.responseBody || {};
      let articleIsEnd;
      let videoPage = videoList.data.responseBody || {};
      let videoIsEnd;
      if(articlePage && (articlePage.currentPage >= articlePage.totalPage)){
        articleIsEnd = true
      }else {
        articleIsEnd = false
      }
      if(videoPage && (videoPage.currentPage >= videoPage.totalPage)){
        videoIsEnd = true
      }else {
        videoIsEnd = false
      }
      return {
        bannerList: bannerList.data.code === '10000' ? bannerList.data.responseBody : [],
        // searchBannerList: searchBannerList.data.code === '10000' ? searchBannerList.data.responseBody : [],
        articleList: articleList.data.code === '10000' ? articleList.data.responseBody.data : [],
        videoList: videoList.data.code === '10000' ? videoList.data.responseBody.data : [],
        hotVideoList: hotVideoList.data.code === '10000' ? hotVideoList.data.responseBody : [],
        hotSpecialColumn: hotSpecialColumn.data.code === '10000' ? hotSpecialColumn.data.responseBody.data : [],
        hotArticleList: hotArticleList.data.code === '10000' ? hotArticleList.data.responseBody : [],
        encyclopediaList: encyclopediaList.data.code === '10000' ? encyclopediaList.data.responseBody : [],
        hotKeywordsList: hotKeywordsList.data.code === '10000' ? hotKeywordsList.data.responseBody.data : [],
        hoursData: hoursData.data.code === '10000' ? hoursData.data.responseBody.data : [],
        marketData: marketData.data.code === '10000' ? marketData.data.responseBody : [],
        articleIsEnd: articleIsEnd,
        videoIsEnd: videoIsEnd,
      }
  },

  // set cooPartner to vuex
  async fetch ({ store, params }) {
    let { data } = await axios.post('/friendlylink/getfriendlyAll', {"secondChannel":0})
    if (data.code === '10000') {
      store.commit('SET_COOPARTNER_LIST', data.responseBody.data)
    }
  },

  created () {
    if (this.marketData) {
      // 格式化行情数据
      this.marketData = this.handleDataFormat(this.marketData)
    }
    if (process.client) {
      // 向资讯列表数据中插入广告数据
      // 获取资讯列表页中的广告数据列表
      let articleBannerList = []
      if (this.bannerList && this.bannerList.length) {
        for (let i = 0; i < this.bannerList.length; i++) {
          if (this.bannerList[i].imagePos === 14) {
            this.bannerList[i].itemType = 'AD'
            articleBannerList.push(this.bannerList[i])
          }
        }
        if (process.client && articleBannerList && articleBannerList.length) {
          switch (articleBannerList.length) {
            case 1:
              this.articleList.splice(4, 0, articleBannerList[0])
              break
            case 2:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(5, 0, articleBannerList[1])
              break
            case 3:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(5, 0, articleBannerList[1])
              this.articleList.splice(15, 0, articleBannerList[2])
              break
            case 4:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(5, 0, articleBannerList[1])
              this.articleList.splice(15, 0, articleBannerList[2])
              this.articleList.splice(16, 0, articleBannerList[3])
              break
            case 5:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(5, 0, articleBannerList[1])
              this.articleList.splice(15, 0, articleBannerList[2])
              this.articleList.splice(16, 0, articleBannerList[3])
              this.articleList.splice(20, 0, articleBannerList[4])
              break
            case 6:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(5, 0, articleBannerList[1])
              this.articleList.splice(15, 0, articleBannerList[2])
              this.articleList.splice(16, 0, articleBannerList[3])
              this.articleList.splice(20, 0, articleBannerList[4])
              this.articleList.splice(21, 0, articleBannerList[5])
              break
            default:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(5, 0, articleBannerList[1])
              this.articleList.splice(15, 0, articleBannerList[2])
              this.articleList.splice(16, 0, articleBannerList[3])
              this.articleList.splice(20, 0, articleBannerList[4])
              this.articleList.splice(21, 0, articleBannerList[5])
              break
          }
        }
      }

      // 拼装返回的资讯列表数据
      for (let i = 0; i < this.indexTabList.length; i++) {
        if (i === 0) {
          this.groupLists.push({
            tabName: this.indexTabList[i],
            list: this.articleList
          })
        }
        if (i === 1) {
          this.groupLists.push({
            tabName: this.indexTabList[i],
            list: this.videoList
          })
        }
      }
    }
  },

  mounted () {
    const browerType = judgeBrower()
    const that = this;
    if(!!window.ActiveXObject || "ActiveXObject" in window){}else{
      // 快讯socket
      var urlTiket = WEBSOCKET_ADDRESS + "newsFlashSocket"
      this.hoursSoket = new WebSocket(urlTiket)
      this.hoursSoket.onopen = function() {
        //发送连接
        that.hoursSoket.send("index_newsFlash")
      };
      var hoursData;
      this.hoursSoket.onmessage = function(data) {
        //获取返回数据
        hoursData = JSON.parse(data.data)
        that.hoursKey = that.hoursKey++
        //判断websocket 是否异常
        if(hoursData.ifHave == 0){
          that.hoursData = JSON.parse(handleWebStorage.getLocalData('hoursData'))
        }else{
          that.hoursData = hoursData
          handleWebStorage.setLocalData('hoursData',JSON.stringify(hoursData))
        }
      };
      //websocket 获取行情数据
      var marketPost = WEBSOCKET_ADDRESS + "indexPriceSocket"
      this.marketSoket = new WebSocket(marketPost)
      this.marketSoket.onopen = function() {
        //发送连接
        that.marketSoket.send("index_Price");
      };
      var marketData;
      this.marketSoket.onmessage = function(data) {
        //获取返回数据
        marketData = JSON.parse(data.data)
        // 重新组合数据
        that.marketData = that.handleDataFormat(marketData)
        //判断websocket 是否异常
        that.marketKey = that.marketKey++
        if(marketData.ifHave == 0){
          that.marketData = JSON.parse(handleWebStorage.getLocalData('marketData'))
        }else{
          handleWebStorage.setLocalData('marketData',JSON.stringify(marketData))
        }
      }
    }
    // 监听滚动条
    // var hotArticle = this.$refs.hotArticleContent.offsetTop
    // let _this = this
    // window.addEventListener('scroll',function () {
    //   let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    //   let clientHeight = document.body.clientHeight
    //   if(scrollTop >= (hotArticle+clientHeight)){
    //     _this.hotfix = true
    //   }else {
    //     _this.hotfix = false
    //   }
    // })
  },
  destroyed(){
    //销毁时关闭websocket
    if(!!window.ActiveXObject || "ActiveXObject" in window){}else {
      this.hoursSoket.close()
      this.marketSoket.close()
    }
  },

  methods: {
    loadingMore (type) {
      if (!type) {
        throw new Error('params "type" is must description')
      }

      let reqUrl = null,
          params = null

      // 根据传递的type类型参数指定获取数据的url地址
      switch (type) {
        case '最新资讯':
          params = handleRequestParams({"currentPage": this.newsPageNum + 1})
          reqUrl = `/article/selectArticleAll/?${params}`
          break

        case '视频':
          params = handleRequestParams({"currentPage": this.videoPageNum + 1})
          reqUrl = `/article/getVideoTabInfo/?${params}`
          break
      }

      try {
        Promise.resolve(axios.post(reqUrl))
        .then(({ data }) => {
          if (type === '最新资讯') {
            let tmpData = data.responseBody.data
            let pageinfo = data.responseBody
            if(pageinfo.currentPage>=pageinfo.totalPage){
              this.articleIsEnd = true
            }else {
              this.articleIsEnd = false
            }
            this.articleList = tmpData.reduce((coll, item) => {
              coll.push(item)
              return coll
            }, this.articleList)

            this.newsPageNum += 1
          }

          if (type === '视频') {
            let tmpData = data.responseBody.data
            let pageinfo = data.responseBody
            if(pageinfo.currentPage>=pageinfo.totalPage){
              this.videoIsEnd = true
            }else {
              this.videoIsEnd = false
            }
            this.videoList = tmpData.reduce((coll, item) => {
              coll.push(item)
              return coll
            }, this.videoList)

            this.videoPageNum += 1
          }
        })
      } catch (e) {
        throw new Error(e)
      }
    },

    handleDataFormat (data) {
      let tmpData = [], resultData = []

      if (data.coinTicker && data.coinTicker.length) {
        tmpData = data.coinTicker.reduce((coll, item) => {
          coll.push(item)
          return coll
        }, tmpData)
      }

      if (data.stock && data.stock.ggMarket && data.stock.ggMarket.length) {
        tmpData = data.stock.ggMarket.reduce((coll, item) => {
          coll.push(item)
          return coll
        }, tmpData)
      }

      if (data.stock && data.stock.mgMarket && data.stock.mgMarket.length) {
        tmpData = data.stock.mgMarket.reduce((coll, item) => {
          coll.push(item)
          return coll
        }, tmpData)
      }

      if (data.stock && data.stock.hsMarket && data.stock.hsMarket.length) {
        tmpData = data.stock.hsMarket.reduce((coll, item) => {
          coll.push(item)
          return coll
        }, tmpData)
      }

      resultData.push(tmpData.slice(0, 7))
      resultData.push(tmpData.slice(7, 14))
      resultData.push(tmpData.slice(14, tmpData.length))

      // 如果最后一组数据不满7个，则从原始数据中读取填入
      if (resultData[2].length < 7) {
        let num = 7 - resultData[2].length
        for (let i = 0; i < tmpData.length; i++) {
          if ((i + 1) <= num) {
            resultData[2].push(tmpData[i])
          }
        }
      }

      return resultData
    },

    chkBannerLength (data, pos) {
      if (Object.prototype.toString.call(data) !== "[object Array]") {
        return
      }

      const tmp = data.filter((item) => {
        return item.imagePos === pos
      })

      return tmp.length ? true : false
    },

    // 添加加载动画
    // loading:function(e){
    //   console.log(e);
    //   this.loadingFlag = e;
    // }
  },

  components: {
    Carousel,
    PictureBanner,
    IndexList,
    ListContainer,
    HotVideoList,
    ListSpecialColumn,
    ListHotArticle,
    Encyclopedia,
    HotKeywords,
    BroadcastInfo,
    // Search
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../assets/stylus/index.styl'

.main
  width 1260px
  margin 16px auto 0 auto
  overflow hidden
  .row-bg
    font-size 0
    .index-left
      width 628px
    .index-middle
      width 300px
    .index-right
      width 300px
  .index-full-broadcast
    width 100%
    margin-bottom 16px
  .index-full-banner
    width 100%
    height 100px
    margin-bottom 16px
    background-color $color-background-d
    overflow hidden
  .index-news-flash
    width 100%
    height 115px
    margin-bottom 30px
    background-color $color-background-d
  .index-list-container
    width 100%
    height auto
    margin-bottom 30px
    .index-info-list
      width 628px
      height auto
      margin-right 16px
    .index-hot-video-list
      width 300px
      height auto
      margin-right 16px
      padding 0
      .hot-video-list-container
        padding 15px
        background-color #fff
    .index-hot-column-list
      width 300px
      height auto
    .index-banner-3
      width 300px
      height 400px
      margin-bottom 30px
    .index-banner-5
      width 300px
      min-height 100px
      margin-bottom 1px
    .index-hot-article-list
      width 300px
      height auto
      &.fixed
        position fixed
        top 0
        height 100%
        overflow auto
</style>
