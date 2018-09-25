/*
* @Description: 专栏作者个人详情页面
* @Author: yym
* @Date: 2018-06-12 14:34
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-16 16:14:39
* @post: 动态获得userId再去获得用户详情和用户的发文和热门文章即可
*/
<template>
  <div class="authorInfo">
    <div class="authorBanner"></div>
    <div class="authorDetail">
      <p>{{authorData.columnName}}
        <span v-if="authorData.identityTag">{{authorData.identityTag}}</span>
      </p>
      <p>{{authorData.columnIntro == null ? '作者太忙了，还没来得及写...':authorData.columnIntro}}</p>
      <div class="baseData">
        <div>
          <span v-if="authorData.artsum>9999">{{Math.floor((authorData.artsum)/1000)/10}}<span
            class="el_w">w+</span></span>
          <span v-else>{{authorData.artsum}}</span>
          <span>投稿篇数</span>
        </div>
        <div>
          <span v-if="authorData.comments>9999">{{Math.floor((authorData.comments)/1000)/10}}<span
            class="el_w">w+</span></span>
          <span v-else>{{authorData.comments}}</span>
          <span>被评论条数</span>
        </div>
        <div>
          <!-- <span>{{authorData.pbowsenum}}</span> -->
          <span v-if="authorData.pbowsenum>9999">{{Math.floor((authorData.pbowsenum)/1000)/10}}<span
            class="el_w">w+</span></span>
          <span v-else>{{authorData.pbowsenum}}</span>
          <span>总浏览量</span>
        </div>
      </div>
      <img v-lazy="changeImg(authorData.columnAvatar)" :alt="authorData.columnName">
      <!-- <i v-if="item.columnAuthed" class="authedLogo"></i> -->
      <i v-if="authorData.vipTag || authorData.realAuthedTag" class="authedLogo"></i>
    </div>
    <div class="authorArticle">
      <!-- 主内容区域 -->
      <section class="index-list-container">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col style="margin-right: 16px" :span="18">
            <section class="index-info-list">
              <index-list
                activeName="TA的投稿"
                :indexTabList="indexTabList"
                :groupLists="groupLists"
                @loadingMore="loadingMore"
                :videoIsEnd="videoIsEnd"
                :articleIsEnd="articleIsEnd"
              >
              </index-list>
            </section>
          </el-col>
          <el-col :span="6">
            <section class="index-hot-column-list">
              <list-container activeTabName="最佳文章">
                <list-hot-article :hotArticleList="hotArticleList"></list-hot-article>
              </list-container>
            </section>
            <section class="list-advert" v-if="advertsList[0] && item.imagePos == 21 && showAd"
                     v-for="(item,index) in  advertsList" :key="index">
              <img @click="toAddress(item)" :src="handleImgAddrHandle(item.imageAddress)"/>
            </section>
          </el-col>
        </el-row>
      </section>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from '@/plugins/axios'
  import IndexList from '@/components/IndexList/IndexList'
  import ListContainer from '@/components/ListContainer/ListContainer'
  import ListSpecialColumn from '@/components/ListSpecialColumn/ListSpecialColumn'
  import ListHotArticle from '@/components/ListHotArticle/ListHotArticle'
  import {handleRequestParams, handleImgAddr} from '@/utils/utils'
  import {OSS_ADDRESS} from '@/config/config'

  export default {
    head(){
      return {
        title: `${this.authorData.columnName || ''}-千氪`,
      }
    },
    name: 'Index',
    data() {
      return {
        authorData: {},
        src: "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/dataNull.png",
        bannerList: [],
        articleList: [],
        hotSpecialColumn: [],
        hotArticleList: [],
        groupLists: [],  // 传递到列表子组件中的组合好的列表数据
        indexTabList: ['TA的投稿'],
        newsPageNum: 1,
        videoPageNum: 1,
        userId: '',
        advertsList: [],
        showAd: true,
        articleIsEnd:false,
        videoIsEnd:true
      }
    },

    async asyncData({store, redirect, error, route}) {
      let userId = route.params.id;
      let [adverts,
        articleList,
        authorData] = await Promise.all([
        axios.post('/siteimageapi/listsiteimage', {"navigator_pos": 2}),
        axios.post('/article/getuserArticleAll', {"createUser": userId, "currentPage": 1, "publishStatus": 1}),   // 文章列表数据
        // axios.post('/article/selectArticleAll', {"currentPage":1}),     // 热门文章列表数据
        axios.post('/userprofile/selectByuserprofileid', {"userId": userId}) // 个人信息
      ])
      adverts = adverts.data.responseBody
      const newList = [];
      if (adverts.length != 0) {
        for (var i in adverts) {
          if (adverts[i].imagePos == 21) {
            newList.push(adverts[i])
          }
        }
      }
      let hotArticleList = [];
      authorData = authorData.data.responseBody.data;
      if (authorData.list != null || authorData.list.length != 0) {
        hotArticleList = authorData.list;
      }
      // 判断文章的是否存在更多的问题
      let articleIsEnd = false
      if(articleList && articleList.data && articleList.data.code === '10000'){
        let contributeData = articleList.data.responseBody
        if(contributeData.currentPage >= contributeData.totalPage){
          articleIsEnd = true
        }else {
          articleIsEnd = false
        }
      }
      return {
        advertsList: newList.splice(0, 1),
        articleList: articleList.data.responseBody.data,
        hotArticleList: hotArticleList,
        authorData: authorData,
        userId: userId,
        articleIsEnd: articleIsEnd,
      }
    },

    // // set cooPartner to vuex
    // async fetch ({ store, params }) {
    //   let { data } = await axios.post('/friendlylink/getfriendlyAll', {"secondChannel":0})
    //   store.commit('SET_COOPARTNER_LIST', data.responseBody.data)
    // },

    created() {
      //处理author不显示广告
      const fullPath = this.$route.fullPath;
      if (fullPath.indexOf('author') > -1) {
        this.showAd = false
      }
      //====


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
    },
    mounted() {
    },
    methods: {
      //默认头像
      changeImg(url,errUrl){
        return {
          src:handleImgAddr(url),
          error: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png'
        }
      },
      //广告图跳转
      toAddress(item) {
        if (item.imageType == 1) {
          window.open('/article/' + item.articleId)
        } else {
          window.open(item.imageDetail);
        }
      },
      handleImgAddrHandle(data, type) {
        if (type) {
          return handleImgAddr(data, 1)
        } else {
          return handleImgAddr(data)
        }
      },
      loadingMore(type) {
        const that = this;
        if (!type) {
          throw new Error('params "type" is must description')
        }
        let reqUrl = null,
          params = null
        // 根据传递的type类型参数指定获取数据的url地址
        switch (type) {
          case 'TA的投稿':
            params = handleRequestParams({
              "createUser": that.userId,
              "publishStatus": 1,
              "currentPage": this.newsPageNum + 1
            })
            reqUrl = `/article/getuserArticleAll/?${params}`
            break
        }
        try {
          Promise.resolve(axios.post(reqUrl))
            .then(({data}) => {
              if (type === 'TA的投稿') {
                let result = data.responseBody
                if(result.currentPage>=result.totalPage){
                  this.articleIsEnd = true
                }else {
                  this.articleIsEnd = false
                }
                let tmpData = data.responseBody.data
                this.articleList = tmpData.reduce((coll, item) => {
                  coll.push(item)
                  return coll
                }, this.articleList)

                this.newsPageNum += 1
              }
            })
        } catch (e) {
          throw new Error(e)
        }
      }
    },

    components: {
      IndexList,
      ListContainer,
      ListSpecialColumn,
      ListHotArticle,
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .list-advert
    width 300px
    height 310px
    overflow hidden
    img
      width 100%
      cursor pointer

  .authorInfo {
    font-family: MicrosoftYaHei;
    width: 1260px;
    margin: 0 auto;
    margin-top: 20px;

    .authorBanner {
      height: 240px;
      background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/authorbanner.png')
      background-size: contain;
      background-repeat: no-repeat;
    }

    .authorDetail {
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
        >div {
          display inline-block
          text-align: center;
          >span:nth-child(2) {
            display block
            color: #9B9B9B;
            padding-top: 16px;
            font-size: 12px;
          }
          >span:nth-child(1) {
            display block
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

    .authorArticle {
      margin-top: 30px;
      margin-bottom 32px;
    }
    .authedLogo {
      display block
      width 20px
      height 20px
      background-image url(../../assets/img/authorInfo/verifyLogo.png)
      background-size 100% 100%
      position absolute
      left 160px
      bottom 50px
      z-index 2
    }
  }
</style>

