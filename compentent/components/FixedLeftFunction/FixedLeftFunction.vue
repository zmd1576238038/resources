/*
 * @Description: 固定显示左侧顶部的工具栏组件
 * @Author: LiuZhen
 * @Date: 2018-06-10 19:56:35
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-21 09:37:53
 */
<template>
  <section class="fixed-left-function">
    <div class="fixed-left-praise" :class="{active: param.praisestatus === 1}" @click="praise">
        <div v-if="showAddOne" :class="{'add-one': showAddOne}">+1</div>
      <svg-icon iconClass="praise" class="icon-style"></svg-icon>
      <p>{{param.praise}}</p>
    </div>
    <div class="fixed-left-collection" :class="{active: param.collectstatus === 1}" @click="collection">
      <svg-icon iconClass="collection" class="icon-style"></svg-icon>
      <p>{{param.collection}}</p>
    </div>
    <div class="fixed-left-comment" @click="comment">
      <svg-icon iconClass="comment" class="icon-style"></svg-icon>
      <p>{{param.comment}}</p>
    </div>
    <div class="fixed-left-watch">
      <svg-icon iconClass="view_black" class="icon-style"></svg-icon>
      <p>{{param.watch}}</p>
    </div>
    <div class="fixed-left-share-weibo" @click="shareToWeibo">
      <svg-icon iconClass="weibo" class="icon-style"></svg-icon>
      <p></p>
    </div>
    <div v-popover:popover1 @mouseover="codeHover" class="fixed-left-share-weixin">
      <svg-icon iconClass="weixin" class="icon-style"></svg-icon>
      <el-popover
        ref="popover1"
        placement="left"
        width="240"
        trigger="hover"
        popper-class="wx-popover"
      >
        <div class='wx-code-modal'>
          <span id='article-wxcode' class='article-wxcode'></span>
          <span class='tx'>打开微信“扫一扫”就能分享给微信好友或者朋友圈了</span>
        </div>
      </el-popover>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'

export default {
  name: 'FixedLeftFunction',
  props: {
    articleId: {},
    showAddOne: {},
    param: {}
  },
  data () {
    return {
    }
  },
  components: {
    SvgIcon
  },
  methods: {
    // 点赞
    praise () {
      this.$emit('praise')
    },
    // 收藏
    collection () {
      this.$emit('collection')
    },
    // 评论
    comment () {
      this.$emit('comment')
    },
    // 分享到微博
    shareToWeibo() {
      this.$emit('shareToWeibo')
    },
    // 微信分享
    codeHover(){
      const code = document.getElementById("article-wxcode");
      while (code.hasChildNodes()) {
        code.removeChild(code.firstChild);
      }
      const QRCode = require('qrcodejs2')
      // 生成二维码
      new QRCode(code, {
          text: location.protocol + '//' + location.host + '/h5Article/' + this.articleId,
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff"
      });
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'


@keyframes addOne
  0%
    top 0
    opacity 1
  30%
    top -5px
    opacity 0.8
  50%
    top -8px
    opacity 0.65
  100%
    top -20px
    opacity 0

.fixed-left-function
  .active
    color #2382EA
  div
    width 60px
    height 60px
    background-color #fff
    text-align center
    color #9B9B9B
    padding-top 10px
    cursor pointer
    border-bottom 1px solid #e6e6e6
    &:not(:last-child)
      margin-bottom 2px
    .icon-style
      width 25px
      height 25px
    p
      font-size 12px
    &.fixed-left-praise
      position relative
      padding-top 5px
      .add-one
        position absolute
        top 0
        right 0
        width auto
        height auto
        padding 0
        margin 0
        border none
        color #2382ea
        font-size 12px
        background transparent
        animation addOne 1s linear
      .icon-style
        width 32px
        height 32px
    &.fixed-left-share-weibo
      &:hover
        color #E63C53
      .icon-style
        width 28px
        height 28px
        margin-top 8px
    &.fixed-left-share-weixin
      &:hover
        color #19D100
      .icon-style
        width 28px
        height 28px
        margin-top 8px
      .article-wxcode
        height 80px
        width 80px
        img
          height 100%
          width 100%
.wx-code-modal
  display flex
  width 200px
  height 100px
  .tx
    padding 0 10px
    padding-right 0
    font-size 12px
    color #333333
    line-height 20px

</style>
