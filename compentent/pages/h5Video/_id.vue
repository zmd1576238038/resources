/*
* @Description: 视频详情H5页
* @Author: cb
* @Date: 2018-06-19
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-20 16:48:18
*/
<template>
  <section class="h5video-container">
    <!-- 视频容器 -->
    <section class='video-content'>
      <!-- 视频地址不为iframe链接 -->
      <video-player
        ref="videoPlayer"
        :options="playerOptions"
        :playsinline="true"
        v-if="(videoData.videoFilename != null && videoData.videoFilename != '') || (videoData.videoUrl != '' && videoData.videoUrl != null && videoData.videoUrl.indexOf('mp4') != '-1')"
      >
      </video-player>
      <!-- 视频地址为iframe链接 -->
      <div v-else-if="(videoData.videoFilename == null || videoData.videoFilename == '') && videoData.videoUrl.indexOf('iframe') == -1"
      v-html="videoData.videoUrl">
      </div>
      <!--<iframe-->
        <!--v-else-if="(videoData.videoFilename == null || videoData.videoFilename == '') && videoData.videoUrl.indexOf('iframe') == -1"-->
        <!--style="width:100%;height:211px" frameborder="0" allowfullscreen="true" :src="videoData.videoUrl"></iframe>-->
      <div
        v-else-if="(videoData.videoFilename == null || videoData.videoFilename == '') && videoData.videoUrl.indexOf('iframe') != -1"
        v-html="videoData.videoUrl"></div>
    </section>
    <main class="video-main">
      <!-- 视频详情 -->
      <section class="h5video-detail">
        <!-- 视频介绍 -->
        <article class="video-introduce">
          <section class="tit">
            <h1 :class="['video-tit',{'isUnfold':isUnfold}]">{{videoData.articleTitle}}</h1>
            <img v-if="isUnfold" @click="unfoldAndPackUp" :src="upImg"/>
            <img v-else @click="unfoldAndPackUp" :src="downImg"/>
          </section>
          <section v-if="isUnfold">
            <p class="video-time" v-if="videoData.updateTimestamp">
              <span>
                <span>{{videoData.articleType == 1 ? '原创' : '转载'}}</span>
                <span class="line">|</span>
                <span>浏览次数：{{videoData.browseNum}}</span>
              </span>
              <span>{{transformTime(videoData.updateTimestamp).slice(0,10)}}</span>
            </p>
            <p class="video-text">{{videoData.articleDescription}}</p>
            <p class="video-tags">
              <span class="video-tag" v-for="(item,index) in videoData.articleTagnames" :key="index">{{item}}</span>
            </p>
            <p class="video-state">声明：本文经授权发布，如若转载请联系原作者；违规转载者法律必究。</p>
          </section>
        </article>
        <!-- 作者信息 -->
        <section class="video-bottom">
          <section class="video-author">
            <section class="author-avatar">
              <img
                :style="{background: 'url('+handleImgAddrHandle(authorData.columnAvatar,1)+ ') no-repeat center/cover'}"/>
            </section>
            <span v-if="authorData.vipTag == 1" class="author-v">V</span>
            <section class="author-info">
              <p class="info-name">{{authorData.columnName}}</p>
              <p class="vipTag">{{authorData.identityTag}}</p>
              <!-- <p class = "info-text">{{authorData.columnIntro}}</p> -->
            </section>
          </section>
          <section class="goods">
            <p>
              <img :src="earningsImg"/>
              <span>作者收益：{{videoData.rewardIncome || 0}}</span>
            </p>
            <p>
              <img :src="goodsImg" @click="praise"/>
              <span>{{videoData.thumbupNum}}</span>
            </p>
          </section>
          <section v-if="comments.totalNumber > 0" class="toApp" @click="goApp">打开APP，获取阅读奖励</section>
        </section>
      </section>
      <!-- 空白条 -->
      <section class="white-line"></section>
      <!-- 为你推荐、热门视频 -->
      <H5Recommend v-if="recommendList[0]" :list="recommendList" :isVideo="true"/>
      <!-- 空白条 -->
      <section class="white-line"></section>
      <!-- h5 评论区 -->
      <Comment v-if="videoData.commentSet === 1" ref="comment" :comment="comments" @openKgApp="goApp"></Comment>
      <!-- h5底部样式 -->
      <h5-footer :goApp="goApp"></h5-footer>
    </main>


  </section>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
  import axios from '@/plugins/axios'
  import {handleRequestParams, handleImgAddr, formatMsgTime} from '@/utils/utils'
  import {mapState, mapActions, mapMutations} from 'vuex'
  import H5Footer from '@/components/H5Footer/H5Footer'
  import H5Recommend from '@/components/H5Recommend/H5Recommend'
  import HotVideoList from '@/components/HotVideoList/HotVideoList'
  import ListContainer from '@/components/ListContainer/ListContainer'
  import RewardModal from '@/components/RewardModal/RewardModal'
  import {toTag} from '@/assets/js/common'
  import {concatUrlMixin} from '@/utils/mixins'
  import Comment from '@/components/CommentH5/Comment'
  import C from '@/assets/js/config'

  export default {
    head: {
      title: '视频',
      meta: [
        {hid: 'keywords', name: 'keywords', content: '视频'},
        {hid: 'description', name: 'description', content: '视频'},
        {name: "viewport", content: "width=device-width,initial-scale=1,user-scalable=0"}
      ],
      script: [
        {src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'}
      ]
    },
    mixins: [concatUrlMixin],
    data() {
      return {
        isUnfold: false,//判断是否展开tit
        upImg: require('../../assets/img/H5/up.png'),//向上三角
        downImg: require('../../assets/img/H5/down.png'),//向下三角
        earningsImg: require('../../assets/img/H5/earnings.png'),//收益图标
        goodsImg: require('../../assets/img/H5/goods.png'),//点赞图标

        playerOptions: {},//视频信息
        videoData: {}, //视频详情数据
        authorData: {},//作者栏数据
        goodsVisible: false, //控制点赞状态
        goodsnumVisible: false, //控制点赞数+1 visible
        collectVisible: false,//控制收藏状态
        collectnumVisible: false,//控制收藏数+1 visible
        hotVideoList: [], //热门视频列表
        recommendList: [],// 为你推荐列表
        // 评论数据
        comments: {
          currentPage: 1, // 当前页
          loadMore: true, // 加载更多
          data: [] //数据列表
        },
        awardVisible: false, //打赏弹窗visible
        advertsList: [],//广告位图片

      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      },
      ...mapState([
        'KGUser'
      ])
    },
    async asyncData({store, redirect, req, route}) {
      // 447067001471508480
      //从url上获取视频id
      const video_id = route.params.id
      //请求视频详情接口
      const userId = store.state.KGUser ? store.state.KGUser.userId : '';
      let [videoDetail, author, comment, recommend] = await Promise.all([
        axios.post('/article/selectByiddetails', {articleId: video_id, userId: userId}), //视频详情数据
        axios.post('/userprofile/selectByuserprofileid', {articleId: video_id}), //作者栏数据
        // axios.post('/video/hotVideoList', {}), //热门视频
        axios.post('/userComment/getCommentArtAll', {articleId: video_id, currentPage: 1, pageSize: 3}), //评论框
        axios.post('/article/relatedArticle', {articleId: video_id}), //为你推荐
        // axios.post('/siteimageapi/listsiteimage', {navigator_pos: 5}) //视频广告位
      ])
      if (videoDetail.data.code == 10007) {
        redirect(C.notFound)
        return
      }
      let videoData = videoDetail.data.responseBody.data
      let authorData = author.data.responseBody.data
      let comments = {},
        hotVideoList = [],
        recommendList = [],
        advertsList = [];
      comments.data = comment.data.code == 10000 ? comment.data.responseBody.data : [] // 处理咨询详情页获取评论数据
      comments.totalNumber = comment.data.code == 10000 ? comment.data.responseBody.totalNumber : ''
      // hotVideoList = hotVideo.data.responseBody //获取热门视频数据
      recommendList = recommend.data.code == 10000 ? recommend.data.responseBody.data : '' //获取为你推荐数据
      // advertsList =  adverts.data.responseBody //获取广告位图片
      if (comment.data.code == 10000 && comment.data.responseBody.currentPage >= comment.data.responseBody.totalPage) {
        // 判断是否已经加载完毕
        comments.loadMore = false
      }
      let playerOptions = {
        height: '211',
        autoplay: false,
        muted: false,
        language: 'zh-CN',
        preload: 'auto',
        sources: [{
          type: "video/mp4",
          // mp4
          src: "https://kgvideo.oss-cn-shenzhen.aliyuncs.com/17679/450705185547886592.mp4"
        }],
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
      }
      //处理视频标签 (将字符串转为数组)
      videoData.articleTagnames = videoData.articleTagnames.split(',')
      videoData.updateTimestamp = parseInt(videoData.updateTimestamp)
      playerOptions.sources[0].src = videoData.videoUrl
      //判断点赞初始状态
      // const goodsVisible = videoData.praisestatus === 0 ? false : true;
      //判断收藏初始状态
      // const collectVisible = videoData.collectstatus === 0 ? false : true;
      return {
        //赋值初始化数据
        videoData,
        authorData,
        playerOptions,
        // goodsVisible,
        // collectVisible,
        comments,
        hotVideoList,
        recommendList,
        advertsList
      }
    },

    components: {
      SvgIcon, HotVideoList, ListContainer, Comment, RewardModal, H5Recommend, H5Footer
    },
    beforeCreate() {
    },
    mounted() {
      console.log(this.videoData)
      const that = this;
      this.browse();
      //微信分享
      const list = {
        url: window.location.href.split("#")[0]
      };
      //调后台接口 返回config 配置
      // weixin/weixinConfig
      this.ajax({
        url: '/weixin/weixinConfig',
        data: list,
        headers: {
          token: ''
        },
        success: (res) => {
          if (res.code == 10000) {
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
          } else {
            that.$message({
              message: res.message,
              type: 'error'
            });
          }
        }
      })
      //设置 title 为文章标题
      let indexTitle = document.getElementsByTagName("title")[0];
      indexTitle.innerHTML = this.videoData.articleTitle;

    },
    methods: {
      //跳App
      goApp() {
        const that = this;
        let config = {
          /*scheme:必须*/
          scheme_IOS: 'kg://?articleId=' + that.videoData.article_id + '&type=3',
          scheme_Adr: 'kgapp://www.kg.com/startapp?articleId=' + that.videoData.article_id,
          download_url: 'https://kg.com/appDownload/list.html',
          timeout: 1000
        };
        let ua = navigator.userAgent.toLowerCase();
        let startTime = Date.now();

        let flag = ua.indexOf('os') > 0;
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
          var loadDateTime = new Date();
          window.setTimeout(function () {
              var timeOutDateTime = new Date();
              if (timeOutDateTime - loadDateTime < 500) {
                window.location = "https://itunes.apple.com/cn/app/千氪-每日为你提供高质量资讯/id1381042034?l=zh&ls=1&mt=8";
              } else {
                window.close();
              }
            },
            25);
          window.location = config.scheme_IOS;
        } else if (navigator.userAgent.match(/android/i)) {
          let ifr = document.createElement('iframe');
          ifr.src = config.scheme_Adr;
          ifr.style.display = 'none';
          document.body.appendChild(ifr);
          let t = setTimeout(function () {
            document.body.removeChild(ifr);
            var endTime = Date.now();
            if (!startTime || endTime - startTime < 2000) {//唤起失败
              window.open(config.download_url)

            } else {//唤起成功
            }
          }, config.timeout);
        }
      },
      //tit展开 收起 isUnfold=false 为收起状态
      unfoldAndPackUp() {
        this.isUnfold = !this.isUnfold
      },
      //广告图跳转
      toAddress(item) {
        if (item.imageType == 1) {
          window.open('/article/' + item.articleId)
        } else {
          window.open(item.imageDetail);
        }
      },
      //跳转标签页
      goTag(item) {
        toTag(item)
      },
      //聚焦评论框
      focusComment() {
        if (this.$store.state.KGUser) {
          // 登录状态, 获取焦点
          this.$refs.comment.getFocus()
        } else {
          // 未登录状态
          this.$message({
            type: 'warning',
            message: '您还未登录'
          })
        }
      },
      //更新打赏数
      updateTipsinCount(res) {
        this.videoData.tipsinCount++
      },
      // 提交评论
      submitComment(data) {
        let userId = this.$store.state.KGUser.userId
        let token = this.$store.state.KGUser.token
        this.ajax({
          url: '/userComment/addComment',
          data: Object.assign(data, {
            articleId: this.videoData.articleId,
            userId
          }),
          headers: {
            token
          },
          success: data => {
            if (data.code === '10000') {
              // 评论的信息加入comment
              this.refreshCommentData() // 刷新评论列表
              this.$refs.comment.clearComment() // 清空评论框
              this.$message({
                type: 'success',
                message: that.videoData.commentAudit == 1 ? '评论成功，需要审核，请耐心等待' : "评论成功",
              })
            } else if (data.code == '29007') {
              that.sensitive = data.message;
              that.loading = false;
              that.sensitiveShow = true;
              textarea.style.border = "1px solid #f00"
            } else {
              this.$message({
                type: 'error',
                message: '评论失败'
              })
            }
          }
        })
      },
      // 获取评论
      getCommentData(flag) {
        this.comments.loadMore = true
        this.ajax({
          url: '/userComment/getCommentArtAll',
          data: {
            articleId: this.videoData.articleId,
            currentPage: this.comments.currentPage++
          },
          success: data => {
            if (data.code === '10000') {
              if (flag === 'refresh') {
                this.comments.data = []
              }
              this.comments.data = this.comments.data.concat(data.responseBody.data)
              this.comments.totalNumber = data.responseBody.totalNumber
              if (data.responseBody.currentPage >= data.responseBody.totalPage) {
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
      // 刷新评论列表
      refreshCommentData() {
        this.comments.currentPage = 1 // 重置页码
        this.getCommentData('refresh') // 获取评论
      },
      giveReward() {
        const id = this.KGUser ? this.KGUser.userId : null;
        if (id == null) {
          this.$message({
            message: "请先登录...",
            type: "warning"
          });
          return;
        }
        if (id == this.videoData.createUser) {
          this.$message({
            message: "不能打赏自己发表的文章...",
            type: "warning"
          });
          return;
        }
        this.awardVisible = true;
      },
      //关闭打赏弹窗
      closeAward() {
        this.awardVisible = false;
      },
      handleImgAddrHandle(data, type) {
        if (type) {
          return handleImgAddr(data, 1)
        } else {
          return handleImgAddr(data)
        }

      },
      transformTime(time) {
        return formatMsgTime(time)
      },
      // 微博分享
      shareToWeibo() {
        let url = window.location.href.split('#')[0];
        const articleImage = this.handleImgAddrHandle(this.videoData.articleImage)
        const share_url =
          "http://share.baidu.com/s?type=text&searchPic=1&sign=on&to=tsina&key=595885820&url=" +
          url +
          "&title=" +
          this.videoData.articleTitle +
          "&pic=" +
          articleImage;
        window.open(
          share_url,
          "newwindow",
          "height=400,width=400,top=100,left=100"
        );
      },
      // 微信分享
      codeHover() {
        const code = document.getElementById("video-wxcode");
        while (code.hasChildNodes()) {
          code.removeChild(code.firstChild);
        }
        const QRCode = require('qrcodejs2')
        // 生成二维码
        new QRCode(code, {
          text: window.location.href,
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff"
        });
      },
      add({articleId, operType, callback}) {
        let userId = ''
        let token = ''
        if (this.$store.state.KGUser) {
          userId = this.$store.state.KGUser.userId
          token = this.$store.state.KGUser.token
        }
        this.ajax({
          url: '/usercollect/addCollect',
          data: {
            articleId: this.videoData.articleId,
            userId,
            operType
          },
          headers: {
            token
          },
          success: callback
        })
      },
      remove({articleId, operType, callback}) {
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
      praise() {
        let callback = data => {
          if (data.code === '10000') {
            this.goodsnumVisible = true
            this.videoData.praisestatus = 1
            this.videoData.thumbupNum++
            this.$message({
              type: 'success',
              message: '点赞成功'
            })
            setTimeout(() => {
              this.goodsnumVisible = false
            }, 500);
          } else {
            this.$message({
              type: 'error',
              message: '点赞失败'
            })
          }
        }
        if (this.$store.state.KGUser) {
          // 登录状态，未点赞
          if (this.videoData.praisestatus === 0) {
            this.add({articleId: this.videoData.articleId, operType: 2, callback})
          } else {
            // 登录状态，已点赞
            callback = data => {
              if (data.code === '10000') {
                this.goodsnumVisible = true
                this.videoData.praisestatus = 0
                this.videoData.thumbupNum--
                this.$message({
                  type: 'success',
                  message: '取消点赞'
                })
                setTimeout(() => {
                  this.goodsnumVisible = false
                }, 500);
              } else {
                this.$message({
                  type: 'error',
                  message: '点赞失败'
                })
              }
            }
            this.remove({articleId: this.videoData.articleId, operType: 2, callback})
          }
        } else {
          // 未登录状态
          this.add({articleId: this.videoData.articleId, operType: 2, callback})
        }
      },
      // 浏览
      browse(){
        let callback = data => {
          if(data.code === '10000') {
            this.videoData.browseNum++ // 文章浏览量+1
          } else {
            console.error('调用浏览接口失败')
          }
        }
        this.add({articleId: this.videoData.articleId, operType: 4, callback})
      },
      // 收藏
      collection() {
        let callback = data => {
          if (data.code === '10000') {
            this.videoData.collectstatus = 1
            this.videoData.collect++
            this.collectnumVisible = true
            setTimeout(() => {
              this.collectnumVisible = false
            }, 500);
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
          if (this.videoData.collectstatus === 0) {
            // 登录状态，未收藏
            this.add({articleId: this.videoData.articleId, operType: 1, callback})
          } else {
            // 登录状态，已收藏
            callback = data => {
              if (data.code === '10000') {
                this.videoData.collectstatus = 0
                this.videoData.collect--
                this.collectnumVisible = true
                setTimeout(() => {
                  this.collectnumVisible = false
                }, 500);
                this.$message({
                  type: 'success',
                  message: '收藏成功'
                })
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
            this.remove({articleId: this.videoData.articleId, operType: 1, callback})
          }
        } else {
          // 未登录状态
          this.$message({
            type: 'warning',
            message: '您还未登录'
          })
        }
      },
      //微信分享
      wxInit(sd) {
        const that = this;
        let links = window.location.href.split("#")[0]; //分享出去的链接
        let title = this.videoData.articleTitle; //分享的标题
        let desc = this.videoData.articleDescription.slice(0, 40) + "..."; //分享的详情介绍
        let articleImage = this.handleImgAddrHandle(this.videoData.articleImage) + "?x-oss-process=image/resize,h_100"

        //生成微信二维码
        wx.ready(function () {
          wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: links, // 分享链接'
            imgUrl: articleImage, // 分享图标
            success: function () {
              that.add({articleId:that.videoData.articleId, operType: 3})
            },
            cancel: function () {
            }
          });
          wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: articleImage, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
              that.add({articleId:that.videoData.articleId, operType: 3})
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });
        });
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'

  .video-js .vjs-fullscreen-control
    display none

  body
    min-width 100%

  .header
    display none

  .footer
    display none

  main
    width 100%

  .h5video-container
    padding-bottom 13.86vw
    width 100%
    height 100%
    background #fff
    position relative
    .app-download
      position absolute
      top 540px
    .video-content
      width 100%
      height 211px
      background-color #000
      position relative
      iframe
        width 100%
        height 211px
        position absolute
        top 0px
        bottom 0px
        left 0px
        right 0px
        margin auto
      .video-js, .video-js.vjs-paused .vjs-big-play-button
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        margin auto
      .vjs-big-play-button
        margin auto
      .video-js.vjs-paused .vjs-big-play-button
        width 45px
        border-radius 50%
      .video-iframe
        width 960px
        position: absolute
        left: 0
        right: 0
        margin: auto

  .white-line
    width 100%
    height 2.6vw
    background #f5f5f5

  .h5video-detail
    width 100%
    padding 20px 17px
    display flex
    flex-direction column
    justify-content space-between
    .video-bottom
      display flex
      flex-direction column
      justify-content space-between
      margin-top 30px
    .toApp
      width 68vw
      height 12.8vw
      line-height 12.8vw
      text-align center
      color #fff
      border-radius 6.4vw
      background #73c1fd /* Old browsers */
      background -moz-linear-gradient(left, #73c1fd 0%, #3084f6 100%) /* FF3.6-15 */
      background -webkit-linear-gradient(left, #73c1fd 0%, #3084f6 100%) /* Chrome10-25,Safari5.1-6 */
      background linear-gradient(to right, #73c1fd 0%, #3084f6 100%) /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      margin 0 auto
      margin-top 8vw
      margin-bottom 5.3vw
    .goods
      display flex
      flex-direction row
      justify-content space-between
      margin-top 8vw
      font-size 3.2vw
      color #8d8d8d
      img
        display inline-block
        width 4vw
        height 4vw
        margin-right 6px
      span
        margin-top 2px
      p
        display flex
    .video-introduce
      width 100%
      .tit
        display flex
        flex-direction row
        justify-content space-between
        img
          display inline-block
          width 13px
          height 13px
          margin-top 6px
      h1
        width 100%
        font-size 4.2vw
        color #333
        margin 0px
        line-height 6.4vw
        word-break break-all
        text-align justify
        margin-right 10px
      .video-time
        margin-top 20px
        margin-bottom 12px
        font-size 3.2vw
        color #8d8d8d
        display flex
        flex-direction row
        justify-content space-between
        .line
          margin 0px 5px
      .video-text
        color #8d8d8d
        line-height 4.2vw
        font-size 3.2vw
        word-break break-all
      .video-state
        color #999
        font-size 3.2vw
        line-height 4.2vw
        background #F4F4F4
        border-radius 10px
        padding 3.2vw 5.3vw
      .video-tags
        margin 12px 0px 18px 0px
        &:hover
          color #2382ea
          // border 1px solid #2382ea
      .video-tag
        display inline-block
        background #F4F4F4
        padding 6px 8px
        color #333
        border 1px solid #F4F4F4
        border-radius 12px
        margin-right 10px
        font-size $font-size-medium
        text-align center
        cursor pointer
    .video-author
      display flex
      flex-direction row
      position relative
      height 17.6vw
      border 1px solid #E6E6E6
      border-radius 8px
      .author-avatar
        width 10.6vw
        height 10.6vw
        overflow hidden
        border-radius 50%
        margin 3.2vw
      .author-v
        position absolute
        display inline-block
        width 4vw
        height 4vw
        font-size 3.2vw
        border-radius 50%
        background #ffec29
        background -moz-linear-gradient(top, #ffec29 0%, #ffcd04 89%, #ffc900 100%)
        background -webkit-linear-gradient(top, #ffec29 0%, #ffcd04 89%, #ffc900 100%)
        backgroundlinear-gradient(to bottom, #ffec29 0%, #ffcd04 89%, #ffc900 100%)
        // filter progid DXImageTransform.Microsoft.gradient( startColorstr='#ffec29', endColorstr='#ffc900',GradientType=0 )
        color #fff
        top 10.6vw
        left 10.6vw
        text-align center
        padding-top 1px
      img
        display inline-block
        width 100%
        height 100%
      .author-info
        width 42.6vw
        // margin-left 17px
        .info-name
          font-size 3.7vw
          width 100%
          color #333
          display flex
          position relative
          no-wrap(1)
          margin-top 3.7vw
        .vipTag
          display inline-block
          padding 2px 7px
          background rgba(236, 245, 255, 1)
          border-radius 11px
          color #2382EA
          font-size 12px
          margin-top 1.33vw
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
        // position absolute
        .info-text
          font-size $font-size-medium
          line-height 22px
          color #666
          height 44px
          margin-top 10px
          width 100%
          no-wrap(2)

  .index-hot-video-list
    display flex
    flex-direction row
    padding-top 40px
    .left
      width 836px
      margin-right 40px
      display flex
      flex-direction column
      .recommend
        font-size 16px
        color #121212
        margin-bottom 16px
    .right
      width 384px
</style>
