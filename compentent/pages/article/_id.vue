/*
 * @Description: 咨询详情页
 * @Author: zcl
 * @Date: 2018-06-08 10:36
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-27 14:25:47
 */
<template>
  <section class="information-details">
    <section v-if="getAdviertisement('41').imageAddress" class="banner-top">
      <a :href="getAdviertisement('41').imageType === 1?((getAdviertisement('41').articleType===1?'/article/':'/video/')+`${getAdviertisement('41').imageDetail}`):getAdviertisement('41').imageDetail" target="_blank">
        <img class="adver-img" v-lazy="handleImgAddrHandle(getAdviertisement('41').imageAddress)" :alt="getAdviertisement('41').adverTitle">
      </a>
      <img v-if="getAdviertisement('41').imageType === 2" src="@/assets/img/adver.png" alt="adv">
      <div v-if="getAdviertisement('41').imageType === 1" class="banner-title"><a :href="getLinkUrl('41')">{{getAdviertisement('41').articleTitle}}</a></div>
    </section>

    <!-- 咨询主体内容 -->
    <section class="content" ref="position">
      <section class="suspension" :style="position.isFixed ? position.styleObj: {}">
        <fixed-left-function :param="leftFixedParams" :showAddOne="showAddOne" :articleId="articleInfo.articleId"
          @praise="praise" @collection="collection" @comment="comment" @shareToWeibo="shareToWeibo">
        </fixed-left-function>
      </section>
      <main>
        <section class="article">
            <section class="title-box">
            <h1>{{articleInfo.articleTitle}}</h1>
            <section class="time-type-column">
              <section class="time-type">
                <section>{{updateTimestampFilter}}</section>
                <section v-if="!!articleTypeFilter" class="type">{{articleTypeFilter}}</section>
              </section>
              <section v-if="articleInfo.articleType === 2" class="source-from">本文来源：{{articleInfo.articleSource}}</section>
              <a v-if="articleInfo.articleType === 2" class="read-origin" :href="articleInfo.articleLink" rel="nofollow">阅读原文</a>
              <section class="column-name">{{articleInfo.columnname}}</section>
            </section>
          </section>
          <p class="description">{{articleInfo.articleDescription}}</p>
          <article v-html="articleInfo.articleText" style="word-break: break-all"></article>
          <!--正文底部广告-->
          <section v-if="getAdviertisement('43').imageAddress" class="banner-bottom">
            <a :href="getLinkUrl('43')">
              <img v-lazy="handleImgAddrHandle(getAdviertisement('43').imageAddress)" :alt="getAdviertisement('43').adverTitle">
            </a>
            <div v-if="getAdviertisement('43').imageType == 1" class="banner-title"><a :href="getLinkUrl('43')">{{getAdviertisement('43').articleTitle}}</a></div>
          </section>
          <section class="declaration">{{declear}}</section>
          <section class="tags">
            <a :href="'/tag/' + tagname" target="_blank" class="tag" v-for="(tagname, index) in articleTagnamesFiler" :key="'tag' + index">{{tagname}}</a>
          </section>
          <section class="upArticle">
            <a v-if="articleInfo.upArticleTitle" :href="articleInfo.upPublishKind===1?'./' + articleInfo.upArticleId:`/video/${articleInfo.upArticleId}`" target="_blank">上一篇：{{articleInfo.upArticleTitle}}</a>
            <div v-if="!articleInfo.upArticleTitle">上一篇：没有了</div>
          </section>
          <section class="downArticle">
            <a v-if="articleInfo.downArticleTitle" :href="articleInfo.downPublishKind===1?'./' + articleInfo.downArticleId:`/video/${articleInfo.downArticleId}`" target="_blank">下一篇：{{articleInfo.downArticleTitle}}</a>
            <div v-if="!articleInfo.downArticleTitle">下一篇：没有了</div>
          </section>
          <section class="btn-group">
            <!--<button v-if="articleInfo.bonusStatus === 1" class="reward" @click="reward">-->
              <!--<svg-icon :iconClass="'reward'"></svg-icon>-->
              <!--<div class="text">打赏<span>{{articleInfo.tipsinCount || 0}}</span></div>-->
            <!--</button>-->
            <button class="income">
              <div class="pop">作者该文章当前收益(TV)</div>
              <div class="icon-income"></div>
              <div class="text">收益<span>{{articleInfo.rewardIncome || 0}}</span></div>
            </button>
          </section>
        </section>
        <section class="comments">
          <Comment :set="articleInfo.commentSet" ref="comment" :comment="comments" :hasLogin="!!this.$store.state.KGUser" :loadMore="comments.loadMore"  @submitComment="submitComment" @loadingMore="getCommentData"></Comment>
        </section>
      </main>
      <!-- 右侧栏 -->
      <aside>
        <section class="author-info">
          <div :class="['author-photo', {vip: !!authorInfo.vipTag, real: !authorInfo.vipTag && !!authorInfo.realAuthedTag}]">
            <a :href="'/author/' + authorInfo.createUser" target="_blank">
               <img v-lazy="handleImgAddrHandle(this.authorInfo.columnAvatar, true)" :alt="authorInfo.columnName">
            </a>
            <!--<div class="real-name" v-if="authorInfo.realAuthedTag || authorInfo.vipTag"></div>-->
          </div>
          <div class="column-name">
            <a :href="'/author/' + authorInfo.createUser" target="_blank">
               {{authorInfo.columnName}}
            </a>
          </div>
          <div class="signature" v-if="authorInfo.identityTag">{{authorInfo.identityTag}}</div>
          <div v-if="authorInfo.columnIntro" class="tag-name">{{authorInfo.columnIntro}}</div>
          <div class="count">
            <div class="item">
              <div class="number">{{authorInfo.artsum}}</div>
              <div class="column">投稿篇数</div>
            </div>
            <div class="item">
              <div class="number">{{ commentsFilter }}</div>
              <div class="column">被评论条数</div>
            </div>
            <div class="item">
              <div class="number">{{ pbowsenumFilter }}</div>
              <div class="column">总浏览量</div>
            </div>
          </div>
          <a :href="'/author/' + authorInfo.createUser" target="_blank" class="more">阅读更多内容，狠戳这里</a>
        </section>

        <section v-if="getAdviertisement('42').imageAddress" class="banner-right">
          <a :href="getLinkUrl('42')">
            <img v-lazy="handleImgAddrHandle(getAdviertisement('42').imageAddress)" :alt="getAdviertisement('42').adverTitle">
          </a>
          <div v-if="getAdviertisement('42').imageType === 1" class="banner-title"><a class="ad-modal" :href="getLinkUrl('42')">{{getAdviertisement('42').articleTitle}}</a></div>
          <img v-if="getAdviertisement('42').imageType === 2" class="adv-img" src="~/assets/img/adver.png" :alt="getAdviertisement('42').articleTitle">
        </section>

        <section v-if="hotArticles.length" class="hot-article">
          <list-container activeTabName="热门文章">
            <list-hot-article :hotArticleList="hotArticles"></list-hot-article>
          </list-container>
        </section>
        <section v-if="recommend.length" class="recommend">
          <list-container activeTabName="为您推荐">
            <div style="padding: 15px;background-color: #fff;">
              <hot-video-list class="recommend-list" :hotVideoList="recommend" :itemNum="3" :isArticle="true"></hot-video-list>
            </div>
          </list-container>
        </section>
      </aside>
    </section>
    <!-- 打赏弹窗 -->
    <reward-modal :updateTipsinCount="updateTipsinCount" :articleId="articleInfo.articleId" :visible="awardVisible" :cancel="closeAward" />
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import FixedLeftFunction from '@/components/FixedLeftFunction/FixedLeftFunction'
import Comment from '@/components/Comment/Comment'
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import ListContainer from '@/components/ListContainer/ListContainer'
import HotVideoList from '@/components/HotVideoList/HotVideoList'
import ListHotArticle from '@/components/ListHotArticle/ListHotArticle'
import RewardModal from '@/components/RewardModal/RewardModal'
import axios from '@/plugins/axios'
import { handleImgAddr , formatMsgTime, getCookie } from '@/utils/utils'
import { OSS_ADDRESS } from '@/config/config'
import C from '@/assets/js/config'

export default {
  head(){
    return {
      title: `${this.articleInfo.articleTitle}-千氪`,
      meta: [
        { hid: 'description', name: 'description', content: this.articleInfo.articleDescription },
        { hid: 'keywords', name: 'keywords', content: this.articleInfo.articleTagnames }
      ]
    }
  },
  data () {
    return {
      // 左侧按钮组的位置
      position: {
        isFixed: false, // 是否悬浮
        // 悬浮的样式
        styleObj: {
          position: 'fixed',
          top: 0,
          left: 0
        }
      },
      showAddOne: false, // 是否显示+1
      awardVisible: false, // 是否显示打赏弹窗
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
        upArticleId: '', // 上一篇文章id
        upArticleTitle: '', // 上一篇文章标题
        downArticleId: '', // 下一篇文章id
        downArticleTitle: '', // 下一篇文章标题
        maxPeople: 0,
        rewardIncome: 0,
      },
      declear: '声明：千氪财经登载此文出于传递更多信息之目的，并不意味着赞同其观点或证实其描述。文章内容仅供参考，不构成投资建议。投资者据此操作，风险自担。', // 声明
      // 作者信息
      authorInfo: {},
      // 热门文章
      hotArticles: [],
      // 广告图片（文章上方 41  文章下方 42  右侧图 43）
      adviertisement: {},
      // 为您推荐
      recommend: [],
      // 评论数据
      comments: {
        currentPage: 1, // 当前页
        loadMore: true, // 加载更多
        data: [] //数据列表
      }
    }
  },
  components: {
    SvgIcon,
    FixedLeftFunction,
    Comment,
    ListContainer,
    HotVideoList,
    ListHotArticle,
    RewardModal
  },
  computed: {
    // 文章来源
    articlefromFilter() {
      let articlefrom = this.articleInfo.articlefrom
      if(articlefrom === 1) return '本站'
      if(articlefrom === 2) return 'btc123'
      if(articlefrom === 3) return '网易财经'
      if(articlefrom === 4) return '东方财富网'
      if(articlefrom === 5) return '币世界'
      if(articlefrom === 6) return '中国经营网'
      if(articlefrom === 7) return '人民网'
      if(articlefrom === 8) return '腾讯网'
      if(articlefrom === 9) return '搜狐新闻'
      if(articlefrom === 10) return '新浪财经'
      return this.articleInfo.articleSource
    },
    // 文章上传时间
    updateTimestampFilter() {
      return formatMsgTime(Number(this.articleInfo.updateTimestamp),1)
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
    },
    commentsFilter(){
      return this.authorInfo.comments > 10000 ? Math.floor(this.authorInfo.comments/1000)/10 + 'W+' : this.authorInfo.comments
    },
    pbowsenumFilter(){
      return this.authorInfo.pbowsenum > 10000 ? Math.floor(this.authorInfo.pbowsenum/1000)/10 + 'W+' : this.authorInfo.pbowsenum
    }
  },
  async asyncData ( {route, req, redirect} ) {
    let articleId = route.params.id // 获取文章id  (447341523198156800)
    let asyncData = { articleInfo: {articleId}, authorInfo: {}, hotArticles: [], adviertisement: {}, recommend: [], comments: {currentPage: 1, loadMore: true, data: []} } // 声明异步数据（在return时返回）
    let token = ''
    let userId = ''
    let cookie = getCookie(req)
    if(cookie && cookie.token && cookie.userId) {
      userId = cookie.userId
      token = cookie.token
    }

    let promiseList = [
      axios.post('/article/selectByiddetails', { articleId: articleId, userId}), // 文章详情数据
      axios.post('/article/getUpdownArticle', { articleId: articleId}), // 上下篇文章
      axios.post('/userprofile/selectByuserprofileid', { articleId: articleId}), // 咨询详情页右侧作者信息
      axios.post('/article/selecttoparticle'), // 咨询详情页右侧热门文章
      axios.post('/siteimageapi/listsiteimage', {"navigator_pos": 4}), // 咨询详情页广告
      axios.post('/article/relatedArticle', { articleId: articleId}), // 咨询详情页右侧为您推荐
      axios.post('/userComment/getCommentArtAll', { articleId: articleId, currentPage: asyncData.comments.currentPage++}), // 咨询详情页获取评论
    ]
    try {
      let [data1, data2, data3, data4, data5, data6, data7] = await Promise.all(promiseList)
      if(data1.data.code === '10007' || data1.data.code === '10003'){
        redirect(C.notFound)
        return
      }
      asyncData.articleInfo = Object.assign(asyncData.articleInfo, data1.data.responseBody.data || {}) // 处理文章详情数据
      asyncData.articleInfo = Object.assign(asyncData.articleInfo, data2.data.responseBody.data[0] || {}) // 处理上下篇文章数据
      asyncData.authorInfo = data3 && data3.data && data3.data.responseBody && data3.data.responseBody.data || {} // 处理咨询详情页右侧作者信息数据
      asyncData.hotArticles = data4.data.responseBody || [] // 处理咨询详情页右侧热门文章数据

      // 处理广告数据
      let list = data5.data.responseBody || []
      for (let i = 0; i < list.length; i++) {
        let imagePos = list[i].imagePos.toString()
        if(!asyncData.adviertisement[imagePos]){
          asyncData.adviertisement[imagePos] = list[i]
        }
      }

      asyncData.recommend = data6.data.responseBody.data || [] // 处理咨询详情页右侧为您推荐数据
      asyncData.comments.data = data7.data.responseBody.data // 处理咨询详情页获取评论数据
      asyncData.comments.totalNumber = data7.data.responseBody.totalNumber
      if(data7.data.responseBody.currentPage >= data7.data.responseBody.totalPage) {
        // 判断是否已经加载完毕
        asyncData.comments.loadMore = false
      }
    } catch (error) {
      console.log('error', error)
    }
    return asyncData
  },
  mounted(){
    this.setPosition() // 设置左侧悬浮按钮位置
    this.browse() // 访问页面增加浏览量
    this.share() // 微博分享访问
  },
  methods: {
    // 获取广告外链
    getLinkUrl(position){
      let info = this.getAdviertisement(position)
      if(info.imageType == 1) { // 资讯类型, 跳转至对应的资讯文章
        return '/article/' + info.articleId
      }
      if(info.imageType == 2) { // 广告
        return this.handleImgAddrHandle(info.imageDetail)
      }
      return this.handleImgAddrHandle(info.imageDetail)
    },
    // 获取广告信息
    getAdviertisement(position){
      return this.adviertisement[position] || {}
    },
    // 设置左侧悬浮按钮位置
    setPosition() {
      let node = this.$refs.position
      this.position.styleObj.left = node.getBoundingClientRect().left + 'px'
      setInterval( () => {
        let top = node.getBoundingClientRect().top
        if(top < 0) {
          this.position.isFixed = true
        } else {
          this.position.isFixed = false
        }
      }, 50)
    },
    // 刷新评论列表
    refreshCommentData(){
      this.comments.currentPage = 1 // 重置页码
      this.getCommentData('refresh') // 获取评论
    },
    // 获取评论
    getCommentData(flag) {
      this.ajax({
        url: '/userComment/getCommentArtAll',
        data: {
          articleId: this.articleInfo.articleId,
          currentPage: this.comments.currentPage++
        },
         success: data => {
          if(data.code === '10000') {
            if(flag === 'refresh') {
              this.comments.data = data.responseBody.data || []
            }else {
              this.comments.data = this.comments.data.concat(data.responseBody.data)
            }
            this.comments.totalNumber = data.responseBody.totalNumber
            if(data.responseBody.currentPage >= data.responseBody.totalPage) {
              // 判断是否已经加载完毕
              this.comments.loadMore = false
            }else {
              this.comments.loadMore = true
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
    //更新打赏数
    updateTipsinCount(res){
      this.articleInfo.tipsinCount++
    },
    // 提交评论
    submitComment(data) {
      let userId = this.$store.state.KGUser.userId
      let token = this.$store.state.KGUser.token
      this.ajax({
        url: '/userComment/addComment',
        data: Object.assign(data, {
          articleId: this.articleInfo.articleId,
          userId
        }),
        headers: {
          token
        },
        success: data => {
          if(data.code === '10000') {
            // 评论的信息加入comment
            this.refreshCommentData() // 刷新评论列表
            this.$refs.comment.clearComment() // 清空评论框

            this.$message({
              type: 'success',
              message: this.articleInfo.commentAudit == 1 ? '评论成功，需要审核，请耐心等待' : "评论成功"
            })
          } else if(data.code === '29007'){
            this.$message({
              type: 'warning',
              message: '检测到评论有敏感词，敏感词：' + data.message
            })
          } else if(data.code === '10004'){
            // 登录失效
            window.location.href = '/login'
          } else {
            this.$message({
              type: 'error',
              message: data.message || '评论失败'
            })
          }
        }
      })
    },
    // 微博分享访问
    share(){
      if(window.location.hash.indexOf('tsina') > -1) {
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
          this.authorInfo.pbowsenum++ // 总浏览量+1
        } else {
          this.message({
            type:'warning',
            message:data.message || '浏览量新增服务器内部错误'
          })
        }
      }
      this.add({articleId: this.articleInfo.articleId, operType: 4, callback})
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
    // 取消收藏、点赞
    remove({articleId, operType, callback}){
      let userId = ''
      let token = ''
      if (this.$store.state.KGUser) {
        userId = this.$store.state.KGUser.userId
        token = this.$store.state.KGUser.token
      }
      this.ajax({
        url: '/usercollect/deleteCollect',
        data: {
          articleId,
          userId,
          operType
        },
        headers: {
          token
        },
        success: callback
      })
    },
    // 点赞
    praise () {
      if (!this.$store.state.KGUser) {
        this.$message({
          type: 'warning',
          message: '您还未登录'
        })
        return false
      }
      let callback = data => {
        if(data.code === '10000') {
          this.articleInfo.praisestatus = 1
          this.articleInfo.thumbupNum++
          this.showAddOne = true
          setTimeout(() => {
            this.showAddOne = false
          }, 1000)
          this.$message({
            type: 'success',
            message: '点赞成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '点赞失败'
          })
        }
      }
      if (this.$store.state.KGUser) {
        if (this.articleInfo.praisestatus === 0) {
          // 登录状态，未点赞
          this.add({articleId: this.articleInfo.articleId, operType: 2, callback})
        } else {
          // 登录状态，已点赞
          callback = data => {
            if(data.code === '10000') {
              this.articleInfo.praisestatus = 0
              this.articleInfo.thumbupNum--
              this.$message({
                type: 'success',
                message: '取消点赞成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: '取消点赞失败'
              })
            }
          }
          this.remove({articleId: this.articleInfo.articleId,operType: 2, callback})
        }
      } else {
        // 未登录状态
        this.add({articleId: this.articleInfo.articleId, operType: 2, callback})
      }
    },
    // 收藏
    collection () {
      let callback = data => {
        if(data.code === '10000') {
          this.articleInfo.collectstatus = 1
          this.articleInfo.collect++
          this.$message({
            type: 'success',
            message: '收藏成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '收藏失败'
          })
        }
      }
      if (this.$store.state.KGUser) {
        if (this.articleInfo.collectstatus === 0) {
          // 登录状态，未收藏
          this.add({articleId: this.articleInfo.articleId, operType: 1, callback})
        } else {
          // 登录状态，已收藏
          callback = data => {
            if(data.code === '10000') {
              this.articleInfo.collectstatus = 0
              this.articleInfo.collect--
               this.$message({
                type: 'success',
                message: '取消收藏成功'
              })
            } else {
               this.$message({
                type: 'error',
                message: '取消收藏失败'
              })
            }
          }
          this.remove({articleId: this.articleInfo.articleId,operType: 1, callback})
        }
      } else {
        // 未登录状态
        this.$message({
          type: 'warning',
          message: '您还未登录'
        })
      }
    },
    // 评论
    comment () {
      if(this.articleInfo.commentSet){
        if (this.$store.state.KGUser) {
          // 登录状态, 获取焦点
          this.$refs.comment.getFocus()
        }else{
          // 未登录状态
          this.$refs.comment.$el.scrollIntoView()
        }
      }else {
        this.$message({
          type:'warning',
          message:'当前文章不允许评论'
        })
      }

    },
    handleImgAddrHandle(data, showDefault){
      return handleImgAddr(data, showDefault)
    },
    // 分享到微博
    shareToWeibo() {
      let url = window.location.href.split('#')[0];
      const articleImage = this.handleImgAddrHandle(this.articleInfo.articleImage)
      const share_url =
        "http://share.baidu.com/s?type=text&searchPic=1&sign=on&to=tsina&key=595885820&url=" +
        url +
        "&title=" +
        this.articleInfo.articleTitle +
        "&pic=" +
        articleImage;
      window.open(
        share_url,
        "newwindow",
        "height=400,width=400,top=100,left=100"
      );
    },
    // 关闭打赏弹窗
    closeAward() {
      this.awardVisible = false;
    },
    // 打赏
    reward() {
      if (!this.$store.state.KGUser) {
        this.$message({
          message: "请先登录...",
          type: "warning"
        })
      }else if (this.$store.state.KGUser.userId == this.articleInfo.createUser) {
        this.$message({
          message: "不能打赏自己发表的文章...",
          type: "warning"
        })
      } else {
        this.awardVisible = true;
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.information-details
  margin 0 auto
  width 1260px
  font-family:  Helvetica,Pingfang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,"sans-serif"
  .banner-title
    position absolute
    width 100%
    bottom 0
    left 0
    font-size 16px !important
    line-height 23px
    background-image: linear-gradient(0deg,#000,transparent)
    z-index 1
    a
      display inline-block
      width 100%
      padding 10px 10px 8px 10px
      color #fff
  >img
    width 100%
    height auto
    // margin-top 10px
  .banner-top
    position relative
    margin-top 16px
    >img
      position absolute
      right 0
      bottom 5px
      width 32px
      height 21px
    .adver-img
      width 100%
      height 100px
    .banner-title
      font-size 18px
  .content
    position relative
    margin-top 26px
    display flex
    justify-content space-between
    .suspension
      position absolute
      top 0
      left 0
      width 60px
      background #fff
      height 360px
    .fixed
      position fixed
      top 0
    main
      margin 0 0 0 75px
      width 868px
      display run-in
      .article
        padding 35px 40px 80px
        background #fff
        p
          margin-bottom 32px
        img
          max-width 100%
          // margin-top 14px
          // margin-bottom 10px
        .title-box
          padding-bottom 14px
          border-bottom 1px dashed #E6E6E6
          h1
            margin-bottom 25px
            word-break break-all
            line-height 42px
            font-size 30px
          .time-type-column
            display flex
            color #9B9B9B
            font-size 12px
          .source-from
            margin-left 30px
          .read-origin
            cursor pointer
            margin-left 20px
          .column-name
            flex-grow 1
            text-align right
          .time-type
            display flex
            .type
              margin-left 10px
              padding-left 15px
              position relative
              &:after
                content ''
                position absolute
                width 4px
                height 4px
                left 0
                top 4px
                background #ccc
                border-radius 50%
        .description
          color #9B9B9B
          font-size 13px
          margin-top 30px
          line-height 20px
        article
          margin-top 30px
          line-height 32px
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
        .banner-bottom
          position relative
          .banner-title
            font-size 16px
          img
            width 100%
            height 100px
            margin-top 15px
        .declaration
          margin-top 30px
          line-height 20px
          font-size 12px
          color rgba(102,102,102,1)
        .tags
          margin-top 30px
          padding 0
          display flex
          .tag
            cursor pointer
            margin-right 10px
            padding 0 8px
            height 26px
            line-height  26px
            color #747474
            font-size 14px
            border 1px solid #EBEBEB
            border-radius 2px
            &:hover
              color #2382ea
              border 1px solid #2382ea
        .upArticle, .downArticle
          margin-top 30px
          font-size 14px
          a
            color #9B9B9B
            &:hover
              color rgb(35,130,234)
        .downArticle
          margin-top 10px
        .btn-group
          display flex
          justify-content center
          margin-top 80px
          text-align center
          .reward, .income
            display flex
            justify-content center
            width 150px
            height 40px
            outline: none
            color #fff
            font-size 14px
            background #2382EA
            border: none
            border-radius 4px
            .text
              height 100%
              line-height 36px
            span
              margin-left 2px
              font-size 12px
          .reward
            margin-right 20px
            cursor pointer
            .svg-icon
              margin-right 5px
              border none
            &:hover
              background rgba(35, 130, 234, .7)
          .income
            position relative
            color #FBA72B
            background #fff
            border: 2px solid #FBA72B
            &:hover .pop
              display block
            .pop
              display none
              padding 0 2px
              position absolute
              left 0
              bottom 45px
              width 100%
              height 36px
              line-height 36px
              color #fff
              font-size 12px
              text-align center
              white-space nowrap
              background linear-gradient(to bottom, #FE7F4B, #FE8D51, #FF9956, #FFA55A)
              border: 2px solid linear-gradient(to bottom, #FE7F4B, #FE8D51, #FF9956, #FFA55A)
              border-radius 4px
              &::after
                content ''
                position absolute
                top 35px
                left calc(50% - 5px)
                border-top 6px solid #FFA55A
                border-left 5px solid transparent
                border-right 5px solid transparent
            .icon-income
              margin-top 8px
              margin-right 5px
              height 18px
              width 14px
              background url(../../assets/img/article/rmb.png) center/cover
      .comments
        padding 23px 40px 20px
        margin-top 16px
        background #fff
        margin-bottom 32px
    aside
      width 300px
      .author-info
        padding 25px 15px
        display flex
        flex-direction column
        align-items center
        background #fff
        .author-photo
          position relative
          display flex
          align-items: center
          width 148px
          height 148px
          border-radius 50%
          border: 8px solid rgba(1,1,1,.1)
          padding: 2px
          a
            display inline-block
            height 130px
            width 130px
            border-radius 130px
            overflow hidden
            img
              width 100%
              height 100%
              border-radius 130px
          .real-name
            position absolute
            right 3px
            bottom 10px
            width 20px
            height 20px
            border-radius 20px
            overflow hidden
            background url("~assets/img/article/vip.png") no-repeat
            background-size contain
          &:after
            content ''
            position absolute
            bottom 10px
            right 3px
            width 20px
            height 20px
            background transparent
        .vip:after
          background url(../../assets/img/article/vip.png) no-repeat center/cover
        .real:after
          background url(../../assets/img/article/real.png) no-repeat center/cover
        .column-name
          margin-top 18px
          font-size 16px
          color rgba(51,51,51,1)
        .tag-name
          margin-top 15px
          font-size 13px
          text-align center
          color #666
          no-wrap(2)
          line-height 20px
          max-width 100%
        .signature
          margin-top 21px
          color #2382ea
          font-size 12px
          background-color rgba(35,130,234,.1)
          border-radius 100px
          padding: 7px
          width: 114px
          text-align center
          white-space nowrap
          overflow hidden
          text-overflow ellipsis

        .count
          margin-top 30px
          width 100%
          display flex
          justify-content space-between
          .item
            color: #9B9B9B
            font-size 12px
            flex-grow 1
            text-align center
            .number
              color #333333
              font-size 18px
            .column
              margin-top 15px
        .more
          margin-top 30px
          width 100%
          height 36px
          line-height 36px
          color #2382EA
          font-size 14px
          text-align center
          border 1px solid #2382EA
          &:hover
            cursor pointer
            color #fff
            background #2382EA
      .banner-right
        position relative
        margin-top 33px
        width 100%
        height auto
        .adv-img
          position absolute
          bottom 5px
          right 5px
        a
          display inline-block
          width 100%
          img
            max-width 100%
        .banner-title
          font-size 12px
          padding: 5px
          line-height: 15px
          .ad-modal
            padding 0
            line-height 1.5rem
            no-wrap(2)
      .recommend
        margin-top 30px
        .desc-bottom
          // padding-bottom 1px
          border-bottom 1px dashed #e6e6e6
        .recommend-list
          background #fff
</style>
