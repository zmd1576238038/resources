/*
* @Description: 视频详情页
* @Author: cb
* @Date: 2018-05-30 14:34
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-27 16:45:40
*/
<template>
  <section class="video-container" v-if="videoData">
    <!-- 视频容器 -->
    <section class='video-content'>
      <!-- 视频地址不为iframe链接 -->
      <div style="overflow: hidden;height: 100%"
        v-if="videoData.videoFilename || (videoData && videoData.videoUrl && videoData.videoUrl.indexOf('mp4') !== -1)"
        @contextmenu="cancelMenu($event)"
      >
        <video-player
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true"
        ></video-player>
      </div>
      <!-- 视频地址为iframe链接 -->
      <div v-else-if="!videoData.videoFilename && videoData.videoUrl && videoData.videoUrl.startsWith('<iframe')" v-html="videoData.videoUrl">
      </div>
      <div
        v-else-if="!videoData.videoFilename && videoData.videoUrl && !videoData.videoUrl.startsWith('<iframe')"
        v-html="videoData.videoUrl">
      </div>
    </section>
    <main class="video-main" style="display: run-in">
      <!-- 操作栏 -->
      <section class="video-handle-bar">
        <!-- 浏览数 -->
        <section>{{videoData.browseNum}}次观看</section>
        <!-- 分享、点赞、收藏、评论、打赏 -->
        <section class="handle-bar">
          <!-- app下载 -->
          <section class="video-good" @click="goDown">
            <span><svg-icon iconClass="app" class="svg-icon color9b9b"></svg-icon></span>
            <span class="color333">下载APP</span>
          </section>
          <!-- 分享 -->
          <section class="video-share">
            <svg-icon iconClass="share" class="svg-icon color9b9b"></svg-icon>
            <span class="color333 share-handel">分享</span>
            <!-- <span :key="kg_user_collect"></span> -->
            <!-- 微博分享 -->
            <span @click="shareToWeibo"><svg-icon iconClass="wb" class="svg-icon color9b9b wb"></svg-icon></span>
            <!-- 微信分享 -->
            <span v-popover:popover1 @mouseover="codeHover">
              <svg-icon iconClass="wx" class="svg-icon color9b9b wx"></svg-icon>
              <el-popover
                ref="popover1"
                placement="top"
                width="260"
                trigger="hover"
                popper-class="wx-popover"
              >
                        <div class='wx-code-modal'>
                          <span id='video-wxcode' class='video-wxcode'></span>
                          <span class='tx'>打开微信“扫一扫”就能分享给微信好友或者朋友圈了</span>
                        </div>

              </el-popover>
            </span>
            <!-- 增加分享数量 -->
            <span class="color333">{{videoData.thumbupNum}}</span>
            <span>
              <!-- 添加字段 kg_user_collect-->
            </span>

          </section>
          <!-- 点赞 -->
          <section class="video-good">
            <span @click="praise"><svg-icon iconClass="zan"
                                            :class="['svg-icon color9b9b',{'goods-active': videoData.praisestatus == 1}]"></svg-icon></span>
            <span class="color333">{{videoData.thumbupNum}}</span>
            <span
              :class="['goods-num',{'goods-num-visible':goodsnumVisible,'goods-red-num':goodsnumVisible && videoData.praisestatus != 1}]">{{videoData.praisestatus === 1 ? '+1' : ''}}</span>
          </section>
          <!-- 收藏 -->
          <section class="video-collect">
            <span @click="collection"><svg-icon iconClass="shoucang"
                                                :class="['svg-icon color9b9b',{'collect-active':videoData.collectstatus == 1}]"></svg-icon></span>
            <span class="color333">{{videoData.collect}}</span>
            <span
              :class="['collect-num',{'collect-num-visible':collectnumVisible,'collect-red-num':collectnumVisible && videoData.collectstatus != 1}]">{{videoData.collectstatus === 1 ? '+1' : ''}}</span>
          </section>
          <!-- 评论 -->
          <section class="video-comment" @click="focusComment">
            <svg-icon iconClass="comment" class="svg-icon color9b9b"></svg-icon>
            <span class="color333">{{videoData.comments}}</span>
          </section>
          <!-- 打赏 -->
          <section class="video-reward" @click="giveReward" v-if="false">
            <svg-icon iconClass="award" class="svg-icon"></svg-icon>
            <span class="award-text">打赏</span>
            <span class="award-num">{{videoData.tipsinCount || 0}}</span>
          </section>
          <!-- 收益 -->
          <section class="video-earnings">
            <div class="pop">作者该文章当前收益(TV)</div>
            <img :src="earningSrc"/>
            <span class="award-text">收益</span>
            <span class="award-num">{{videoData.rewardIncome || 0}}</span>
          </section>
        </section>
      </section>
      <!-- 视频详情 -->
      <section class="video-detail">
        <!-- 视频介绍 -->
        <article class="video-introduce">
          <h1 class="video-tit">{{videoData.articleTitle}}</h1>
          <p class="video-time" v-if="videoData.updateTimestamp">
            {{transformTime(videoData.updateTimestamp)+'发布'}}
            <span class="source-from">{{videoData.articleType === 1?'原创':'视频来源:'+videoData.articleSource}}</span>
            <a v-if="videoData.articleType === 2" class="read-origin" :href="videoData.articleLink">原视频地址</a>
          </p>
          <p class="video-text">{{videoData.articleDescription}}</p>
          <p class="video-state">声明：未经作者授权，禁止转载</p>
          <section class="video-tags">
            <nuxt-link :to="concatUrl('tag',item)" v-for="(item,index) in videoData.articleTagnames" :key="index">
              <span class="video-tag">{{item}}</span>
            </nuxt-link>
          </section>
        </article>
        <!-- 作者信息 -->
        <section class="video-right">
          <section class="video-author">
            <section class="author-avatar">
              <nuxt-link :to="concatUrl('author',authorData.createUser)" target="_blank">
                <img :style="{background: 'url('+handleImgAddrHandle(authorData.columnAvatar,1)+ ') no-repeat center/cover'}"/>
              </nuxt-link>
            </section>
            <span v-if="authorData.vipTag == 1" class="author-v">V</span>
            <section class="author-info">
              <nuxt-link :to="concatUrl('author',authorData.createUser)" target="_blank">
                <p class="info-name">{{authorData.columnName}}</p>
              </nuxt-link>
              <p class="vipTag">{{authorData.identityTag}}</p>
              <p class="info-text">{{authorData.columnIntro}}</p>
            </section>
          </section>

        </section>
      </section>
      <!-- 为你推荐、热门视频 -->
      <section class="index-hot-video-list">
        <section class="left">
          <!-- 视频banner广告位 -->
          <!-- imageType  1：资讯类  2：广告  3：其他 -->
          <section class="video-banner" v-if="leftAdvar">
            <section v-if="leftAdvar.imageType == 2">
              <img @click="toAddress(leftAdvar)" :src="handleImgAddrHandle(leftAdvar.imageAddress)"/>
              <img @click="toAddress(leftAdvar)" class="adver" :src="adverImg"/>
            </section>
            <section v-else-if="leftAdvar.imageType == 1">
              <img @click="toAddress(leftAdvar)" :src="handleImgAddrHandle(leftAdvar.imageAddress)"/>
              <span @click="toAddress(leftAdvar)" class="ar-tit">{{leftAdvar.articleTitle}}</span>
            </section>
            <section v-else>
              <img @click="toAddress(leftAdvar)" :src="handleImgAddrHandle(leftAdvar.imageAddress)"/>
            </section>
          </section>
          <p class="recommend">为您推荐</p>
          <hot-video-list :showSpacer="false" descLocal="bottom" showType="landscape"
                          :hotVideoList="recommendList"></hot-video-list>
          <!-- <comment :comment="commentList"/> -->
          <Comment :set="videoData.commentSet" ref="comment" :comment="comments" :hasLogin="!!this.$store.state.KGUser"
                   :loadMore="comments.loadMore" @submitComment="submitComment" @loadingMore="getCommentData"></Comment>
        </section>
        <section class="right">
          <!-- 视频作者下方广告位 -->
          <section class="video-bottom" v-if="rightAdvar">
            <section v-if="rightAdvar.imageType == 2">
              <img @click="toAddress(rightAdvar)" :src="handleImgAddrHandle(rightAdvar.imageAddress)"/>
              <img @click="toAddress(rightAdvar)" class="adver" :src="adverImg"/>
            </section>
            <section v-else-if="rightAdvar.imageType == 1">
              <img @click="toAddress(rightAdvar)" :src="handleImgAddrHandle(rightAdvar.imageAddress)"/>
              <span @click="toAddress(rightAdvar)" class="ar-tit">{{rightAdvar.articleTitle}}</span>
            </section>
            <section v-else>
              <img @click="toAddress(rightAdvar)" :src="handleImgAddrHandle(rightAdvar.imageAddress)"/>
            </section>
          </section>
          <list-container activeTabName="热门视频">
            <hot-video-list :hotVideoList="hotVideoList" descLocal="right" showType="vertical"></hot-video-list>
          </list-container>
        </section>
      </section>
    </main>
    <section class="app-download">
    </section>
    <!-- 打赏弹窗 -->
    <reward-modal :updateTipsinCount="updateTipsinCount" :articleId="videoData.articleId" :visible="awardVisible"
                  :cancel="closeAward"/>
  </section>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
  import axios from '@/plugins/axios'
  import {handleRequestParams, handleImgAddr, formatMsgTime} from '@/utils/utils'
  import {mapState, mapActions, mapMutations} from 'vuex'
  import HotVideoList from '@/components/HotVideoList/HotVideoList'
  import ListContainer from '@/components/ListContainer/ListContainer'
  import RewardModal from '@/components/RewardModal/RewardModal'
  import Comment from '@/components/Comment/Comment'
  import {toTag} from '@/assets/js/common'
  import C from '@/assets/js/config'
  import {concatUrlMixin} from '@/utils/mixins'

  export default {
    head(){
      return {
        title: `${this.videoData.articleTitle || '视频详情'}-千氪`,
        meta: [
          {hid: 'keywords', name: 'keywords', content: `${this.videoData.articleTagnames && this.videoData.articleTagnames.join(',')}`},
          {hid: 'description', name: 'description', content: `${this.videoData.articleDescription || '视频详情'}`},
        ],
        script: [
          {src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'}
        ]
      }

    },
    mixins: [concatUrlMixin],
    data() {
      return {
        earningSrc: require('../../assets/img/article/rmb.png'), //收益图标
        adverImg: require('../../assets/img/adver.png'), //广告图标
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
        rightAdvar: [],//右侧广告图
        leftAdvar: null,//左侧广告图
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
      let [videoDetail, author, hotVideo, comment, recommend, adverts] = await Promise.all([
        axios.post('/article/selectByiddetails', {articleId: video_id, userId: userId}), //视频详情数据
        axios.post('/userprofile/selectByuserprofileid', {articleId: video_id}), //作者栏数据
        axios.post('/video/hotVideoList', {}), //热门视频
        axios.post('/userComment/getCommentArtAll', {articleId: video_id, currentPage: 1,pageSize:10}), //评论框
        axios.post('/article/relatedArticle', {articleId: video_id}), //为你推荐
        axios.post('/siteimageapi/listsiteimage', {navigator_pos: 5}) //视频广告位
      ])
      if (videoDetail && videoDetail.data && (videoDetail.data.code === '10007' || videoDetail.data.code=== '10003')) {
        redirect(C.notFound)
        return
      }
      let videoData = videoDetail && videoDetail.data && videoDetail.data.responseBody && videoDetail.data.responseBody.data || []
      let playerOptions = {
        height: '460',
        autoplay: false,
        muted: false,
        language: 'zh-CN',
        preload: 'auto',
        sources: [{
          type: "video/mp4",
          // mp4
          src: ""
        }],
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
      }
      //处理视频标签 (将字符串转为数组)
      videoData.articleTagnames = videoData.articleTagnames && videoData.articleTagnames.split(',')
      videoData.updateTimestamp = parseInt(videoData.updateTimestamp)
      playerOptions.sources[0].src = videoData.videoUrl

      let authorData = author.data.responseBody.data
      let comments = {},
        hotVideoList = [],
        recommendList = [],
        advertsList = [],
        leftAdvar = [],
        rightAdvar = [];
      comments.data = comment.data.code == 10000 ? comment.data.responseBody.data : [] // 处理咨询详情页获取评论数据
      comments.totalNumber = comment.data.code == 10000 ? comment.data.responseBody.totalNumber : ''
      comments.loadMore = true
      comments.currentPage = 1
      hotVideoList = hotVideo.data.responseBody //获取热门视频数据
      recommendList =  recommend.data && recommend.data.responseBody.data //获取为你推荐数据
      advertsList = adverts.data.responseBody //获取广告位图片
      //处理右侧广告数据
      for (var i in advertsList) {
        //判断是否为广告图
        if (advertsList[i].imagePos == 52) {
          rightAdvar.push(advertsList[i])
          //判断是否为资讯图
        } else if (advertsList[i].imagePos == 51) {
          leftAdvar.push(advertsList[i])
        }
      }
      rightAdvar = rightAdvar[0] ? rightAdvar[0] : null
      leftAdvar = leftAdvar[0] ? leftAdvar[0] : null
      if (comment.data.code == 10000 && comment.data.responseBody.currentPage >= comment.data.responseBody.totalPage) {
        // 判断是否已经加载完毕
        comments.loadMore = false
      }

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
        advertsList,
        rightAdvar,
        leftAdvar,
      }
    },

    components: {
      SvgIcon, HotVideoList, ListContainer, Comment, RewardModal
    },
    beforeCreate() {
    },
    mounted() {
      const that = this;
      //浏览量增加
      this.browse()
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
    },
    methods: {
      cancelMenu(e){
        e.preventDefault()
      },
      // 去下载
      goDown(){
        location.href = '/download'
      },
      //广告图跳转
      toAddress(item) {
        if (item.imageType == 1) {
          window.open('/article/' + item.articleId)
        } else {
          if (item.imageDetail.startsWith('http://') || item.imageDetail.startsWith('https://')) {
            window.open(item.imageDetail);
          } else {
            this.$message({
              type: 'warning',
              message: '链接错误！',
              showClose: true
            })
          }

        }
      },
      //跳转标签页
      goTag(item) {
        toTag(item)
      },
      //聚焦评论框
      focusComment() {
        if(this.videoData.commentSet){
          if (this.$store.state.KGUser) {
            // 登录状态, 获取焦点
            this.$refs.comment.getFocus()
          } else {
            // 未登录状态
            this.$refs.comment.$el.scrollIntoView(true)
            this.$message({
              type: 'warning',
              message: '您还未登录'
            })
          }
        }else {
          this.$message({
            type:'warning',
            message:'当前视频不允许评论'
          })
        }

      },
      //更新打赏数
      updateTipsinCount(res) {
        this.videoData.tipsinCount++
      },
      // 提交评论
      submitComment(data) {
        const that = this;
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
              that.refreshCommentData() // 刷新评论列表
              that.$refs.comment.clearComment() // 清空评论框
              that.$message({
                type: 'success',
                message: that.videoData.commentAudit == 1 ? '评论成功，需要审核，请耐心等待' : "评论成功",
              })
            } else if (data.code == '29007') {
              that.sensitive = data.message;
              that.loading = false;
              that.sensitiveShow = true;
              this.$message({
                type: 'warning',
                message: '检测到评论有敏感词，敏感词：' + data.message
              })
            } else {
              that.$message({
                type: 'error',
                message: data.message || '评论失败'
              })
            }
          }
        })
      },
      // 获取评论
      getCommentData(flag) {
        this.comments.loadMore = true
        var that = this
        const data = {
          articleId: this.videoData.articleId,
          currentPage: ++this.comments.currentPage,
          pageSize:10
        }
        axios.post('/userComment/getCommentArtAll', data).then(function (res) {
          const result = res.data
          if (result.code === '10000') {
            if (flag === 'refresh') {
              that.comments.data = []
            }
            that.comments.data = that.comments.data.concat(result.responseBody.data)
            that.comments.totalNumber = result.responseBody.totalNumber
            if (result.responseBody.currentPage >= result.responseBody.totalPage) {
              // 判断是否已经加载完毕
              that.comments.loadMore = false
            }
          } else {
            that.$message({
              type: 'error',
              message: '获取评论列表失败'
            })
          }
        })
      },
      // 刷新评论列表
      refreshCommentData() {
        this.comments.currentPage = 0 // 重置页码
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
        return formatMsgTime(time,1)
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
        const that = this;
        const code = document.getElementById("video-wxcode");
        while (code.hasChildNodes()) {
          code.removeChild(code.firstChild);
        }
        const QRCode = require('qrcodejs2')
        // 生成二维码
        new QRCode(code, {
          text: location.protocol + '//' + location.host + '/h5Video/' + that.videoData.articleId,
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff"
        });
      },
      browse(){
        let callback = data => {
          if(data.code === '10000') {
            this.videoData.browseNum++ // 文章浏览量+1
            this.videoData.pbowsenum++ // 总浏览量+1
          } else {
            this.message({
              type:'warning',
              message:data.message || '浏览量新增服务器内部错误'
            })
          }
        }
        this.add({articleId: this.videoData.articleId, operType: 4, callback})
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
        if(!this.$store.state.KGUser){
          this.$message({
            type: 'warning',
            message: '您还未登录'
          })
          return false
        }
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
        let links = location.protocol + '//' + location.host + '/h5Video/' + that.videoData.articleId; //分享出去的链接
        // let links = window.location.href.split("#")[0]; //分享出去的链接
        let title = this.videoData.articleTitle; //分享的标题
        let desc ; //分享的详情介绍
        try {
          desc = this.videoData.articleDescription.slice(0, 40) + "...";
        }catch(e){
          desc = ''
        }
        let articleImage = this.handleImgAddrHandle(this.videoData.articleImage) + "?x-oss-process=image/resize,h_100"

        //生成微信二维码
        wx.ready(function () {
          wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: links, // 分享链接'
            imgUrl: articleImage, // 分享图标
            success: function () {
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
  .video-banner, .video-bottom
    position relative
    width 100%
    height 80px
    overflow hidden
    margin-bottom 40px
    cursor pointer
    >section
      position relative
      height 80px
    img
      width 100%
      height 100%
    .adver
      position absolute
      right 0
      bottom 0
      width 24px
      height auto
    .ar-tit
      position absolute
      display inline-block
      width 100%
      padding 5px
      word-break break-all
      bottom 0
      left 0
      color #fff
      no-wrap(2)
      line-height 23px
      background-image:linear-gradient(0deg, #000, transparent)

  .wx-popover
    height auto !important
    .wx-code-modal
      width 260px
      height 97px
      display flex
      .tx
        width 120px
        font-size 13px
        margin-top 20px
        margin-left 10px

  .video-container
    width 100%
    height 100%
    padding-bottom 100px
    background #fff
    position relative
    .app-download
      position absolute
      top 540px
    .video-content
      width 100%
      height 540px
      background-color #000
      position relative
      iframe
        width 960px
        height 450px
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
      .video-js.vjs-paused .vjs-big-play-button
        width 45px
        height 44px
        border-radius 50%
        border none
      .video-iframe
        width 960px
        position: absolute
        left: 0
        right: 0
        margin: auto

  .video-handle-bar
    width 100%
    height 60px
    line-height 60px
    display flex
    flex-direction row
    justify-content space-between
    font-size $font-size-medium
    .handle-bar
      display flex
      .award-num
        margin-right 10px
        font-size 12px
      .video-earnings
        position relative
        padding 0px 26px
        height 38px
        line-height 34px
        border 2px solid #fba72b
        color #FBA72B
        margin-top 11px
        margin-left 20px
        cursor auto
        &:hover .pop
          display block
        .pop
          display none
          padding 0 2px
          position absolute
          left 0
          bottom 45px
          width 100%
          min-width 140px
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
        img
          display inline-block
          width 14px
          height 18px
          margin-top 8px
          margin-right 10px
        .award-text
          margin-right 4px
      .video-reward
        height 38px
        line-height 38px
        color #fff
        background #2382EA
        margin-top 11px
        display flex
        flex-direction row
        cursor pointer
        padding 0px 26px
        .svg-icon
          margin-top 8px
        .award-text
          margin 0px 4px 0px 10px
      .color9b9b
        color #9b9b9b
        margin-right 12px
        margin-top 17px
      .color333
        color #333
        font-size 14px
        margin-right 26px
      section
        display flex
        cursor pointer
      .share-handel
        margin-right 14px
      .wb, .wx
        display none
        // transition:5s;

        width 25px
        height 25px
      .wx
        margin-right 30px
      .video-share:hover
        .color9b9b, span
          color #2382EA
        .wb, .wx
          display inline-block
          width 25px
        .wb
          color #E63C53
        .wx
          color #19D100
      // 点赞样式
      .video-good, .video-collect
        position relative
        .goods-active, .collect-active
          color #2382EA
        .goods-num, .collect-num
          display none
          color #2382ea
          font-size 12px
          position absolute
          left 16px
          top -14px
        .goods-num-visible, .collect-num-visible
          display inline-block
        .goods-red-num, .collect-red-num
          color #FC5A5D !important

  .video-detail
    width: 100%
    padding: 27px 0px;
    border-top 1px solid #E6E6E6
    border-bottom 1px solid #E6E6E6
    display flex
    flex-direction row
    justify-content space-between
    .video-right
      display flex
      flex-direction column
      justify-content space-between
      width 384px
    .video-introduce
      width 836px
      h1
        font-size 30px
        color #333
        margin 0px
        line-height 42px
        word-break break-all
      .video-time
        margin-top 18px
        margin-bottom 30px
        font-size $font-size-small
        color #666
        .source-from
          margin-left 30px
        .read-origin
          cursor pointer
          margin-left 20px
      .video-text
        color #666
        line-height 24px
        font-size $font-size-medium-x
        // overflow hidden
        // text-overflow ellipsis
        // white-space nowrap
      .video-state
        color #9b9b9b
        font-size $font-size-small
        margin 19px 0px
      .video-tag
        display inline-block
        padding 6px 8px
        color #747474
        border 1px solid #ebebeb
        border-radius 2px
        margin-right 10px
        font-size $font-size-medium
        text-align center
        cursor pointer
      .video-tag:hover
        color #2382EA
        border-color #2382EA
    .video-author
      display flex
      flex-direction row
      position relative
      .author-avatar
        width 100px
        height 100px
        overflow hidden
        border-radius 50%
      .author-v
        position absolute
        display inline-block
        width 20px
        height 20px
        border-radius 50%
        background #ffec29
        background -moz-linear-gradient(top, #ffec29 0%, #ffcd04 89%, #ffc900 100%)
        background -webkit-linear-gradient(top, #ffec29 0%, #ffcd04 89%, #ffc900 100%)
        backgroundlinear-gradient(to bottom, #ffec29 0%, #ffcd04 89%, #ffc900 100%)
        // filter progid DXImageTransform.Microsoft.gradient( startColorstr='#ffec29', endColorstr='#ffc900',GradientType=0 )
        color #fff
        top 75px
        left 75px
        text-align center
        padding-top 1px
      img
        display inline-block
        width 100px
        height 100px
      .author-info
        width 208px
        margin-left 17px
        .info-name
          font-size $font-size-medium-x
          width 100%
          color #333
          display flex
          position relative
          no-wrap(1)
        .vipTag
          display inline-block
          padding 5px 7px
          background rgba(236, 245, 255, 1)
          border-radius 11px
          color #2382EA
          font-size 12px
          margin-top 10px
        // position absolute
        .info-text
          font-size 13px
          line-height 22px
          color #666
          height 44px
          margin-top 10px
          width 100%
          no-wrap(2)

  .index-hot-video-list
    display flex
    flex-direction row
    // padding-top 40px
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
