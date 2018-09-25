/*
 * @Description: 咨询详情H5页
 * @Author: guokang
 * @Date: 2018-06-19 11:10
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-21 17:34:54
 */
<template>
  <section class="information-details">
    <section class="title">
      <p >{{articleInfo.articleTitle}}</p>
    </section>
    <section class = "article-author">
      <img :src="avatarFilter" >
      <span class="viptag">
        <img src= '../../assets/img/article/vip.png' v-if ="authorInfo.vipTag ===1"/>
        <img src= '../../assets/img/article/real.png' v-if ="authorInfo.vipTag !==1 &&authorInfo.realAuthedTag === 1"/>
      </span>
      <span class="nick-name">{{authorInfo.columnName}}</span>
      <span class="tag-name"  v-if="authorInfo.identityTag">{{authorInfo.identityTag}}</span>
    </section>
    <section class="artilce-time">
      <span><span>{{updateTimestampFilter}}</span><span class="article-type" v-if="!!articleTypeFilter">{{articleTypeFilter}}</span></span><span class="right"><svg-icon iconClass="view" class="icon-view"></svg-icon><span>{{leftFixedParams.watch}}</span></span>
    </section>
    <section class="article-dec">
      <p>{{articleInfo.articleDescription}}</p>
    </section>
    <section :class= "[ moreBtnStatus ? 'article-content' : 'article-main']" ref="articleText">
      <article v-html="articleInfo.articleText"></article>
      <section v-if = "moreBtnStatus" class="boxshow"></section>
    </section>
    <section v-if = "moreBtnStatus" class="moreBtnStatus" @click="watchAll">
        展开全文
    </section>
    <section class="article-info" v-if = "!moreBtnStatus">
      {{declear}}
    </section>
    <section class="article-source" v-if = "articleInfo.articleType === 2">
      <span>本文来源：</span><span>{{articleInfo.articleSource}}</span><a :href="articleInfo.articleLink" target="view_window">阅读原文</a>
    </section>
    <section class="article-btns" @click ="openKgApp">
      {{btnName}}
    </section>
    <section class="tags">
      <a target="_blank" class="tag" v-for="(tagname, index) in articleTagnamesFiler" :key="'tag' + index">{{tagname}}</a>
    </section>
    <section class="article-profitBox">
      <span class="profit-prant">
      <span class="profit" @click="showPop">
        <div :class="['pop', {'active': popShow}]">作者该文章当前收益(TV)</div>
        <img src="../../assets/img/article/rmb.png"/>
        <p>收益</p>
      </span>
      <p class="profitNum">{{articleInfo.rewardIncome || 0}}</p>
      </span>
      <span  class="praise-prant">
        <span class="praise" @click="like">
          <svg-icon iconClass="zan" class="icon-zan"></svg-icon>
          <p>点赞</p>
        </span>
         <p class="num">{{leftFixedParams.praise}}</p>
      </span>
    </section>
    <!-- 空白条 -->
    <section class="white-line"></section>
    <!-- 为你推荐、热门文章 -->
    <H5Recommend :list="recommend" />
    <!-- 空白条 -->
    <section class="white-line"></section>
    <!-- 评论 -->
    <section>
      <Comment v-if="articleInfo.commentSet === 1" ref="comment" :comment="comments" @openKgApp ="openKgApp"></Comment>
    </section>
    <!-- h5底部样式 -->
    <section>
      <H5Footer :goApp="openKgApp"></H5Footer>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import Comment from '@/components/CommentH5/Comment'
import H5Footer from '@/components/H5Footer/H5Footer'
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import H5Recommend from '@/components/H5Recommend/H5Recommend'
import axios from '@/plugins/axios'
import { handleImgAddr , formatMsgTime, getCookie } from '@/utils/utils'
import { OSS_ADDRESS } from '@/config/config'
import C from '@/assets/js/config'

export default {
  head: {
        title: '',
        meta: [
            { hid: 'keywords', name: 'keywords', content: '资讯' },
            { hid: 'description', name: 'description', content: '资讯' },
            { name:"viewport", content:"width=device-width,initial-scale=1,user-scalable=0" }
        ],
        script: [
          {src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'}
        ]
  },
  layout:'login',
  data () {
    return {
      popShow: false, // 气泡显示
      // 文章信息
      articleInfo: {
        commentSet: 0, // 是否显示评论 0 不显示 1 显示
        columnAvatar: '',
        articleTitle: '', // 文章标题
        updateTimestamp: '', // 文章上传时间
        articleType: '', // 文章类别 1 原创 2 转载
        columnname: '', // 栏目名称
        articleImage: '', // 文章图片
        articleDescription: '', // 文章描述
        articleText: '', // 文章内容
        articleTagnames: '', // 文章标签
        maxPeople: 0,
        rewardIncome: 0,
        authorData:{},//作者栏数据
      },
      declear: '声明：本文经授权发布，如若转载请联系原作者；违规转载 者法律必究。', // 声明
      btnName:'打开APP，获取阅读奖励', //打开APP
      // 作者信息
      authorInfo: {

      },
      // 热门文章
      hotArticles: [],
      // 广告图片（文章上方 41  文章下方 42  右侧图 43）
      adviertisement: [],
      // 为您推荐
      recommend: [],
      // 评论数据
      comments: {
        currentPage: 1, // 当前页
        loadMore: true, // 加载更多
        data: [] //数据列表
      },
      moreBtnStatus:true,

    }
  },
  components: {
    SvgIcon,
    Comment,
    H5Footer,
    H5Recommend
  },
  computed: {
    // 文章上传时间
    updateTimestampFilter() {
      return formatMsgTime(Number(this.articleInfo.updateTimestamp))
    },
    // 文章类别
    articleTypeFilter() {
      if (this.articleInfo.articleType === 1) return '原创'
      if(this.articleInfo.articleType === 2) return '转载'
      return ''
    },
    articleTagnamesFiler() {
      if(this.articleInfo.articleTagnames) return this.articleInfo.articleTagnames.split(',')
      return ''
    },
    avatarFilter() {
      return handleImgAddr(this.authorInfo.columnAvatar)
    },
    // 收藏、点赞、评论、浏览数量统计
    leftFixedParams(){
      return {
        praise: this.articleInfo.thumbupNum || 0,
        praisestatus: this.articleInfo.praisestatus || 0,
        collection: this.articleInfo.collect || 0,
        collectstatus: this.articleInfo.collectstatus || 0,
        comment: this.articleInfo.comments || 0,
        watch: this.articleInfo.browseNum || 0
      }
    }
  },
  async asyncData ( {route, req} ) {
    let articleId = route.params.id // 获取文章id  (447341523198156800)
    let asyncData = { articleInfo: {articleId}, authorInfo: {}, hotArticles: [], adviertisement: [], recommend: [], comments: {currentPage: 1, loadMore: true, data: []} } // 声明异步数据（在return时返回）
    let token = ''
    let userId = ''
    const cookie = getCookie()
    if(cookie && cookie.token && cookie.userId) {
      userId = cookie.userId
      token = cookie.token
    }
    let promiseList = [
      axios.post('/article/selectByiddetails', { articleId: articleId, userId}), // 文章详情数据
      axios.post('/userprofile/selectByuserprofileid', { articleId: articleId}), // 咨询详情页右侧作者信息
      axios.post('/article/relatedArticle', { articleId: articleId}), // 咨询详情页右侧为您推荐
      axios.post('/userComment/getCommentArtAll', { articleId: articleId, currentPage: 1, pageSize: 3}), // 咨询详情页获取评论
    ]
    try {
      let [data1, data2, data3, data4] = await Promise.all(promiseList)
      if(data1.data.code == 10007){
        redirect(C.notFound)
        return
      }
      asyncData.articleInfo = Object.assign(asyncData.articleInfo, data1.data.responseBody.data || {}) // 处理文章详情数据
      asyncData.authorInfo = Object.assign(asyncData.authorInfo, data2.data.responseBody.data || {}) // 处理咨询详情页右侧作者信息数据
      asyncData.recommend = data3.data.responseBody.data || [] // 处理咨询详情页右侧为您推荐数据
      asyncData.comments.data = data4.data.responseBody.data // 处理咨询详情页获取评论数据
      asyncData.comments.totalNumber = data4.data.responseBody.totalNumber
    } catch (error) {
      console.log('error', error)
    }
    return asyncData
  },
  mounted(){
    this.browse() // 访问页面增加浏览量
    this.share() // 微博分享访问
    let h1 = this.$refs.articleText.getBoundingClientRect();  //文章内容父容器的高度
    let h2 = this.$refs.articleText.childNodes[0].getBoundingClientRect();  //文章内容子容器的高度
    if( h1.bottom >= h2.bottom ) {
      this.moreBtnStatus = false
    }
    //微信分享
    this.getConfigSet()
    //设置 title 为文章标题
    let indexTitle = document.getElementsByTagName("title")[0];
    indexTitle.innerHTML = this.articleInfo.articleTitle;
  },
  methods: {
    // 显示气泡
    showPop() {
      this.popShow = true
      if(this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.popShow = false
      }, 1500)
    },
    // 微博分享访问
    share(){
      if(window.location.hash.indexOf('weixin') > -1) {
        let callback = data => {
          if(data.code === '10000') {
          } else {
            console.error('调用分享接口失败')
          }
        }
        this.add({articleId: this.articleInfo.articleId, operType: 4, callback})
      }
    },
    // 浏览
    browse(){
      let callback = data => {
        if(data.code === '10000') {
          this.articleInfo.browseNum++ // 文章浏览量+1
        } else {
          console.error('调用浏览接口失败')
        }
      }
      this.add({articleId: this.articleInfo.articleId, operType: 4, callback})
    },
    // 点赞
    like() {
      let callback = data=>{
        if(data.code === '10000'){
          this.articleInfo.thumbupNum++ // 点赞量+1
        }else {
          this.$message({
            type:'warning',
            message:data.message
          })
        }
      }
      this.add({articleId:this.articleInfo.articleId, operType: 2, callback})
    },
    // 收藏、点赞、分享、浏览
    add({articleId, operType, callback}){
      let userId = ''
      let token = ''
      if (this.$store.state.KGUser) {
        userId = this.$store.state.KGUser.userId
        token = this.$store.state.KGUser.token
      }
      this.ajax({
        url: '/usercollect/addCollect',
        data: {
          articleId: this.articleInfo.articleId,
          userId,
          operType
        },
        headers: {
          token
        },
        success: callback
      })
    },
    //调后台接口 返回config 配置
    getConfigSet() {
     const list = {
        url: window.location.href.split("#")[0]
      };
      const that = this
      this.ajax({
        url: '/weixin/weixinConfig',
        data: list,
        headers: {
          token:''
        },
      success:  (res) => {
        if(res.code === '10000'){
              res = res.responseBody;
              wx.config({
                debug: false,
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr,
                signature: res.signature,
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
              });
              setTimeout(() => {
                that.wxInit(res);
              }, 2000);
        }else{
            that.$message({
                message: res.message,
                  type: 'error'
            });
        }
        }
      })
    },
    //去app
    openKgApp() {
       const that =this;
       let config = {
            /*scheme:必须*/
            scheme_IOS: 'kg://?articleId='+that.articleInfo.articleId+'&type=3',
            scheme_Adr: 'kgapp://www.kg.com/startapp?articleId='+that.articleInfo.articleId,
            download_url: 'https://kg.com/appDownload/list.html',
            timeout: 1000
        };

        let ua = navigator.userAgent.toLowerCase();
        let startTime = Date.now();
        let flag =ua.indexOf('os') > 0;
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
           // console.log(navigator.userAgent.match(/(iPhone|iPod|iPad);?/i))
          var loadDateTime = new Date();
          window.setTimeout(function() {
          var timeOutDateTime = new Date();
          if (timeOutDateTime - loadDateTime < 500) {
            window.location = "https://itunes.apple.com/cn/app/千氪-每日为你提供高质量资讯/id1381042034?l=zh&ls=1&mt=8";
          } else {
            // window.close();
          }
          },
          25);
          window.location = config.scheme_IOS;
        } else if (navigator.userAgent.match(/android/i)) {
           let ifr = document.createElement('iframe');
          ifr.src =  config.scheme_Adr;
          ifr.style.display = 'none';
            document.body.appendChild(ifr);
            let t = setTimeout(function() {
              document.body.removeChild(ifr);
              var endTime = Date.now();
              if (!startTime || endTime - startTime < 2000) {//唤起失败
                  window.open( config.download_url)

              } else {//唤起成功
              }
          }, config.timeout);
        }
    },
    // 刷新评论列表
    refreshCommentData(){
      this.comments.currentPage = 1 // 重置页码
      this.getCommentData('refresh') // 获取评论
    },
    // 获取评论
    getCommentData(flag) {
      this.comments.loadMore = true
      this.ajax({
        url: '/userComment/getCommentArtAll',
        data: {
          articleId: this.articleInfo.articleId,
          currentPage: this.comments.currentPage++
        },
         success: data => {
          if(data.code === '10000') {
            if(flag === 'refresh') {
              this.comments.data = []
            }
            this.comments.data = this.comments.data.concat(data.responseBody.data)
            this.comments.totalNumber = data.responseBody.totalNumber
            if(data.responseBody.currentPage >= data.responseBody.totalPage) {
              // 判断是否已经加载完毕
              this.comments.loadMore = false
            }
          } else {
            this.$message({
              type: 'error',
              message: '获取评论列表失败'
            })
          }
         }
      })
    },
    handleImgAddrHandle(data){
      return handleImgAddr(data)
    },
    //展开全文
    watchAll() {
      this.moreBtnStatus = false;
    },
    //微信分享
    wxInit(sd) {
      const that = this;
      let links = window.location.href.split("#")[0]; //分享出去的链接
      let title = this.articleInfo.articleTitle; //分享的标题
      let desc = this.articleInfo.articleDescription.slice(0, 40) + "..."; //分享的详情介绍
      let articleImage = this.handleImgAddrHandle(this.articleInfo.articleImage) +  "?x-oss-process=image/resize,h_100"

      //生成微信二维码
      wx.ready(function() {
        wx.onMenuShareTimeline({
          title: title, // 分享标题
          link: links, // 分享链接'
          imgUrl: articleImage, // 分享图标
          success: function() {
            that.add({articleId:that.articleInfo.articleId, operType: 3})
          },
          cancel: function() {}
        });
        wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: articleImage, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
            that.add({articleId:that.articleInfo.articleId, operType: 3})
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.error(function (res) {
          console.log(res)
        })
      });
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
body
  min-width 100%
  background #fff
.header
  display none
.index-footer
  display none
.information-details
  margin 0 auto
  width 1024px
  font-family MicrosoftYaHei
  .title
    font-size 24px
    color #222
    margin 17px 20px
    line-height 34px
    p
      word-break break-all
  .article-author
    margin-left 20px
    position relative
    img
      width 40px
      height 40px
      border-radius 50%
      line-height 40px
      display inline-block
      vertical-align middle
    .viptag
      img
        position absolute
        bottom 0
        left 26px
        width 14px
        height 14px
        background transparent
    &:after
      content ''
      position absolute
      bottom 0
      right 0
      width 10px
      height 10px
      background transparent
    span
      display inline-block
    .nick-name
      margin-left 20px
      font-size 14px
      color #222
      font-family PingFangSC-Regular
    .tag-name
      margin-left 10px
      color #1886FA
      font-size 12px
      font-family PingFangSC-Regular
      background rgba(236,245,255,1)
      border-radius 6px
      padding 2px 10px
  .artilce-time
    margin 10px 20px
    span
      display inline-block
      color #999
      font-family:PingFangSC-Regular;
      font-size 12px
    .right
      display inline-block
      text-align right
      position relative
      float right
      line-height 20px
      height 20px
      span
        display inline-block
        position absolute
        top 0px
        right 0px
      .icon-view
        margin-right 10px
        display inline-block
        position absolute
        top 0px
        left -64px
    .article-type
      margin-left 20px
  .article-dec
    margin 20px 23px
    background rgba(244,244,244,1)
    border-radius 8px
    p
      color #333
      font-size 14px
      padding 16px 18px 16px 20px
      line-height 26px
      word-break break-all
  .article-content
    margin 0 18px 20px 20px
    position relative
    max-height 400px
    overflow hidden
    .boxshow
      width 100%
      position absolute
      bottom 0
      background #f00
      background:linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,1));
      height 25px;
      z-index 10
    p
      color #4d4d4d
      font-size 16px
      line-height 28px
    img
      max-width 100%
  article
    .ql-align-center
      text-align center
    .ql-align-right
      text-align right
    .ql-align-justify
      text-align justify
    a
      color rgb(35,130,234)
      &:hover
        text-decoration underline
    em
      font-style italic
  .article-main
    margin 0 18px 20px 20px
    overflow hidden
    p
      color #4d4d4d
      font-size 16px
      line-height 28px
    img
      max-width 100%
  .article-info
    margin 20px 23px
    background:rgba(244,244,244,1);
    border-radius:5px;
    padding 10px 13px 10px 20px
    font-size 12px;
    font-family PingFangSC-Regular
    color rgba(153,153,153,1)
    line-height 24px
  .article-source
    margin 20px 23px
    span
      font-size 12px
      color #999
    a
      color #1886FA
      font-size 12px
      margin-left 10px
  .article-btns
    background linear-gradient(124.8deg,rgba(115,193,253,1),rgba(48,132,246,1))
    font-size 16px
    color #fff
    margin 30px 35px 10px 35px
    text-align center
    border-radius 40px
    padding 14px 0
  .tags
    margin 20px 20px
    a
      display inline-block
      background rgba(244,244,244,1)
      border-radius 35px
      color #333
      margin-right 10px
      padding 5px 10px
      margin-top 20px
      font-size 12px
  .article-profitBox
    margin 60px 20px 40px
    text-align center
    .profit-prant
      display inline-block
      height 80px
      .profitNum
        color #FF9C1D
        font-size 14px
        margin-top 10px
    .praise-prant
      margin-left 35px
      display inline-block
      height 80px
      .num
        color #333
        font-size 14px
        margin-top 10px
    .profit
      display inline-block
      width 50px
      height 50px
      border-radius 50%
      border 1px solid #FF9C1D
      position relative
      text-align center
      top 0px
      left 0px
      .pop
        display none
        position absolute
        left -52px
        bottom 60px
        width 150px
        height 36px
        line-height 36px
        color #fff
        font-size 12px
        text-align center
        white-space nowrap
        background linear-gradient(to bottom, #FE7F4B, #FE8D51, #FF9956, #FFA55A)
        border: 2px solid linear-gradient(to bottom, #FE7F4B, #FE8D51, #FF9956, #FFA55A)
        border-radius 4px
      .active
        display block
        &::after
          content ''
          position absolute
          top 35px
          left calc(50% - 5px)
          border-top 6px solid #FFA55A
          border-left 5px solid transparent
          border-right 5px solid transparent
      img
        display inline-block
        position absolute
        top 8px
        left 16px
      p
        position absolute
        top 29px
        left 12px
        color #FF9C1D
        font-size 12px

    .praise
      display inline-block
      width 50px
      height 50px
      border-radius 50%
      border 1px solid #666
      position relative
      text-align center
      top 0px
      left 0px

      .icon-zan
        color #666
        position absolute
        top 5px
        left 16px
      p
        position absolute
        top 29px
        left 12px
        color #666
        font-size 12px
  .white-line
    width 100%
    height 2.6vw
    background #f5f5f5
  .moreBtnStatus
    width 100%
    text-align center
    font-size 14px
    color #1886FA
@media screen and (max-width: 768px)
  .information-details
    margin 0 auto
    width 100%
    font-family MicrosoftYaHei
</style>
