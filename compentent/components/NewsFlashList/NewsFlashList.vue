/*
 * @Description: 快讯列表页组件
 * @Author: LiuZhen
 * @Date: 2018-06-12 11:02:55
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-27 17:10:27
 */
<template>
  <section class="news-flash-list">
    <div v-show="showWeixinShare" class='wx-code-modal' :style="{top: QRCodePosition.top + 'px', left: QRCodePosition.left + 'px'}">
      <span id="news-wxcode" class='news-wxcode'></span>
      <span class='tx'>打开微信“扫一扫”<br>就能分享给微信好<br>友或者朋友圈了</span>
    </div>
    <el-tabs v-model="activeTabName">
      <p class="date">
        <svg-icon iconClass="time" class="icon-style"></svg-icon>
        <span>{{nowdate}}</span>
      </p>
      <el-tab-pane :label="item.tabName" :name="item.tabName" v-for="(item,index) in groupLists" :key="index">
        <el-row
          v-if="(activeTabName === '全部' && newFlash && newFlash.allCount) ||
                (activeTabName === '区块链快讯' && newFlash && newFlash.qukuailianCount) ||
                (activeTabName === '金融快讯' && newFlash && newFlash.jinrongCount) ||
                (activeTabName === '股市快讯' && newFlash && newFlash.gushiCount)"
          class="new-news"
          @click.native="getNewFlash">
          有{{activeTabName ==='全部'?newFlash.allCount:activeTabName==='区块链快讯'?newFlash.qukuailianCount:activeTabName==='金融快讯'?newFlash.jinrongCount:newFlash.gushiCount}}条新快讯，点击查看
        </el-row>
        <ul>
          <li v-for="(newsItem,newsIndex) in item.list" :key="newsIndex">
            <div class="news-item-content">
              <p class="news-item-time">{{newsItem.createDate}}</p>
              <p :class="['news-item-text', {'error': newsItem.level}]">{{newsflashTextFilter(newsItem)}}<span class="overflow-text" v-if="newsItem.overflow" @click="changeOverflow(newsItem)">{{newsItem.isSpread ? '收起' : '展开'}}</span></p>
              <p class="news-item-share">
                <span>分享到</span>
                <span title="分享到微博" @click="shareToWeibo(newsItem)"><svg-icon iconClass="weibo" class="icon-style"></svg-icon></span>
                <span :ref="'weixin' + index + '-' + newsIndex" @mouseover="showQRCode(index, newsIndex,newsItem)" @mouseout="hideQRCode()" title="分享到微信">
                  <svg-icon iconClass="weixin" class="icon-style"></svg-icon>
                </span>
              </p>
              <a v-if="newsItem.newsflashLink" :href="newsItem.newsflashLink" target="_blank" class="news-item-detail" rel="nofollow">查看原文 ></a>
            </div>
          </li>
        </ul>
        <div v-if="showAddmoreFilter(item.tabName)" class="loading-more">
          <a href="javascript:;" @click="loadingMore(item.tabName)">查看更多</a>
        </div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'

export default {
  name: 'NewsFlashList',
  data () {
    return {
      lists: [],
      activeTabName: '全部',
      showWeixinShare: false,
      QRCodePosition: {
        left: 0,
        top: 0
      },
      sharePath: {
        weixin: '/h5Newslist/', // 微信扫一扫分享页面路径地址
        weibo: '/h5Newslist/', // 微博分享页面路径
      }
    }
  },
  props: {
    nowdate: {},
    indexTabList: {
      type: Array,
      default: () => [],
      required: true
    },
    groupLists: {
      type: Array,
      default: () => [],
      required: true
    },
    showAddmore: {
      type: Object,
      required: true
    },
    newFlash:{
      type: Object,
    }
  },
  components: {
    SvgIcon
  },
  methods: {
    getNewFlash(){
      this.$emit('getNewFlash',this.activeTabName)
    },
    // 收起、展开切换
    changeOverflow(item) {
      item.isSpread = !item.isSpread
      if(item.isSpread){
        item.max = Infinity
      } else{
        item.max = 130
      }

    },
    newsflashTextFilter(item) {
      if(!item.max) item.max = 130
      let text = ''
      if(item.newsflashTitle) text = "【" + item.newsflashTitle + "】" + item.newsflashText
      else text = item.newsflashText
      if(text.length > item.max) {
        // 新增对象属性注意使用set插入
        this.$set(item,'overflow',true)
        this.$set(item,'isSpread',false)
        text = text.slice(0 ,130) + '...'
      }
      return text
    },
    showAddmoreFilter(type) {
      if(type === '全部') return this.showAddmore.all
      if(type === '区块链快讯') return this.showAddmore.block
      if(type === '金融快讯') return this.showAddmore.finance
      if(type === '股市快讯') return this.showAddmore.equity
    },
    // 加载更多
    loadingMore (type) {
      this.$emit('loadingMore', type)
    },
    // 分享到微博
    shareToWeibo(item) {
      let url = location.protocol + '//' + location.host + this.sharePath.weibo + item.newsflashId;
      const text = item.newsflashText.slice(0, 40) + '...'
      const articleImage = "http://pro-kg-oss.oss-cn-beijing.aliyuncs.com/video/112.jpg";
      const share_url = "http://share.baidu.com/s?type=text&searchPic=1&sign=on&to=tsina&key=595885820&url=" + url + "&title=" + text + '&pic=' + articleImage;
      window.open(share_url, 'newwindow', 'height=400,width=400,top=100,left=100');
    },
    // 隐藏微信分享
    hideQRCode(){
      this.showWeixinShare = false
    },
    // 显示微信分享
    showQRCode(index, newsIndex,item) {
      this.initQRCode(item.newsflashId)
      let rect = this.$refs['weixin' + index + '-' + newsIndex][0].getBoundingClientRect()
      this.QRCodePosition.top = rect.top - 120
      this.QRCodePosition.left = rect.left - 100
      this.showWeixinShare = true
    },
    // 实例化微信分享
    initQRCode(id){
      const code = document.getElementById('news-wxcode');
      code.innerHTML = ''
      const QRCode = require('qrcodejs2')
      // 生成二维码
      new QRCode(code, {
        text: location.protocol + '//' + location.host + '/h5Newslist/' + id,
        width: 80,
        height: 80,
        colorDark: "#000000",
        colorLight: "#ffffff"
      });
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.news-flash-list
  .el-tabs__header
    background #fff
    padding-left 30px
    margin 0
  .el-tab-pane
    padding-top 10px
    // background #fff
  .date
    padding-left 30px
    height 40px
    line-height 40px
    color #666666
    font-size 14px
    background:rgba(247,247,247,1);
    .icon-style
      vertical-align middle
    span
      margin-left 10px
      vertical-align middle
  .new-news
    margin 0 30px 0
    height 40px
    line-height 40px
    background #2382EA
    color #fff
    font-size 14px
    text-align center
    cursor pointer
    &:hover
      background rgba(35, 130, 234, .7)
  .wx-code-modal
    align-items center
    padding 18px 10px
    position fixed
    top 0
    left 0
    z-index 999
    background #fff
    overflow hidden
    .news-wxcode
      float left
      height 80px
      width 80px
      img
        height 100%
        width 100%
    .tx
      float left
      margin-left 10px
      font-size 12px
      color #333333
      line-height 20px
  ul
    padding 5px 40px 20px
    margin-bottom 15px
    width 100%
    background-color #fff
    li
      width 100%
      padding-top 20px
      .news-item-content
        position relative
        border-bottom 1px dashed #E6E6E6
        .overflow-text
          cursor pointer
          margin-left 5px
          font-size 14px
          color #2382EA
          &:hover
            text-decoration underline
        .news-item-detail
          position absolute
          left 0
          bottom 20px
          font-size 12px
          color #666666
          &:hover
            color #2382EA
        p
          &.news-item-time
            position relative
            font-size 12px
            margin-bottom 14px
            &:before
              content ''
              display inline-block
              width 6px
              height 6px
              position absolute
              top 4px
              left -11px
              border-radius 80%
              background-color #52A1F7
          &.news-item-text
            font-size 16px
            color #333
            line-height 26px
            letter-spacing: 1px
            margin-bottom 60px
          &.error
            color #FC5A5D
          &.news-item-share
            position absolute
            right 0
            bottom 20px
            font-size 12px
            color #9B9B9B
            span
              &:not(:last-child)
                margin-right 5px
              &:nth-child(2),
              &:nth-child(3)
                display inline-block
                width 20px
                height 20px
                border-radius 50%
                background-color #9B9B9B
                text-align center
                line-height 23px
                position relative
                top 1px
                cursor pointer
                .icon-style
                  width 13px
                  height 13px
                  color #fff
              &:nth-child(2)
                &:hover
                  background-color #E63C53
              &:nth-child(3)
                &:hover
                  background-color #19D100
  .loading-more
    width 100%
    height 50px
    text-align center
    line-height 50px
    // border 1px solid #ccc
    background-color $color-background-d
    a
      display inline-block
      padding 0 10px
      height 100%
      font-size 13px
      color #2382EA
</style>
