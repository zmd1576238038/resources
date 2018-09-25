/*
 * @Description: 自定义轮播组件
 * @Author: LiuZhen
 * @Date: 2018-06-12 14:44:21
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-21 13:24:54
 */
<template>
  <section class="broadcase-info-container">
    <h3 class="broad-info-title" v-if="isTitle">

      <span class="title">
        <em class="icon"><svg-icon iconClass="newsflash" class="icon-style"></svg-icon></em>
        <em class="name">{{titleName}}</em>
      </span>

      <span class="more">
        <nuxt-link to="/newslist">更多</nuxt-link>
        <svg-icon iconClass="left_arrow" class="icon-arrow"></svg-icon>
      </span>
    </h3>

    <div class="broadcase-info-wrap">
      <div v-if="!showType" class="broadcase-info-content" ref="content">
        <nuxt-link to="/newslist" v-for="(item,index) in reverseArr" :key="index">
          <span :class="{'is-level':item.level == 1}">{{item.createDate+'&emsp; | &emsp;'+newsflashTextFilter(item)}}</span>
        </nuxt-link>
      </div>

      <div v-if="showType==='quotation'" class="broadcase-info-content" ref="content">
        <div v-for="(item, index) in broadcaseData" :key="index" class="quotation-content">
          <ul>
            <li v-for="(quotaItem, quotaIndex) in item" :key="quotaIndex" v-if="quotaItem">
              <span>
                <a href="javascript:;" rel="nofollow" :title="(quotaItem.coinType && quotaItem.name) ? quotaItem.coinType+'/' + quotaItem.name  : quotaItem.stockName">
                  {{(quotaItem.coinType && quotaItem.name) ? quotaItem.coinType+'/' + quotaItem.name  : quotaItem.stockName}}
                </a>
                <!-- 百分号 -->
                <em v-if="quotaItem.coinType" :class="{'fall-style':quotaItem.riseRate*1<0,'rise-style':quotaItem.riseRate*1>0}">{{quotaItem.riseRate}}%</em>
                <em v-if="!quotaItem.coinType" :class="{'fall-style':quotaItem.increPer*1<0,'rise-style':quotaItem.increPer*1>0}">{{quotaItem.increPer}}%</em>
                <!-- <em v-if="quotaItem.coinType"><svg-icon iconClass="up" class="icon-style" :class="{'fall-style':quotaItem.riseRate*1<0,'rise-style':quotaItem.riseRate*1>0}"></svg-icon></em>
                <em v-if="!quotaItem.coinType"><svg-icon iconClass="up" class="icon-style" :class="{'fall-style':quotaItem.increPer*1<0,'rise-style':quotaItem.increPer*1>0}"></svg-icon></em> -->
              </span>
              <span>
                <em v-if="quotaItem.coinType" :class="{'fall-style':quotaItem.riseRate*1<0,'rise-style':quotaItem.riseRate*1>0}">￥{{quotaItem.price}}</em>
                <em v-if="!quotaItem.coinType" :class="{'fall-style':quotaItem.increPer*1<0,'rise-style':quotaItem.increPer*1>0}">￥{{quotaItem.nowPri}}</em>
                <!-- 上下箭头 -->
                <em v-if="quotaItem.coinType"><svg-icon iconClass="up" class="icon-style" :class="{'fall-style':quotaItem.riseRate*1<0,'rise-style':quotaItem.riseRate*1>0}"></svg-icon></em>
                <em v-if="!quotaItem.coinType"><svg-icon iconClass="up" class="icon-style" :class="{'fall-style':quotaItem.increPer*1<0,'rise-style':quotaItem.increPer*1>0}"></svg-icon></em>
                <!-- <em v-if="quotaItem.coinType" :class="{'fall-style':quotaItem.riseRate*1<0,'rise-style':quotaItem.riseRate*1>0}">{{quotaItem.riseRate}}%</em>
                <em v-if="!quotaItem.coinType" :class="{'fall-style':quotaItem.increPer*1<0,'rise-style':quotaItem.increPer*1>0}">{{quotaItem.increPer}}%</em> -->
              </span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </section>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'

export default {
  name: 'BroadcaseInfo',
  data () {
    return {
      elePHeight: -80,
      childNodesLen: 0,
      currentEleNo: 0,
      timer: null
    }
  },

  props: {
    isTitle: {
      type: Boolean,
      default: false
    },
    titleName: {
      type: String,
      default: ''
    },
    broadcaseData: {
      type: Array,
      default: () => []
    },
    broaddelay: {
      type: Number,
      default: 7000
    },
    showType: {
      type: String,
      default: ''
    }
  },
  computed:{
    reverseArr(){
      return this.broadcaseData.reverse() //eslint-disable-line
    }
  },

  methods: {
    newsflashTextFilter(item) {
      if(item.newsflashTitle) item.text = "【" + item.newsflashTitle + "】" + item.newsflashText
      else item.text = item.newsflashText
      return item.text
    }
  },

  mounted () {
    let nodeDOM = this.$refs.content
    this.childNodesLen = nodeDOM.childNodes.length
    // 24小时快讯
    if(!this.showType){
      this.currentEleNo = this.childNodesLen -1
      nodeDOM.style['transform'] = `translate3d(0, ${this.elePHeight*this.currentEleNo+'px'}, 0)`
      if(nodeDOM.childNodes.length<1)return false
      this.timer = setInterval(()=>{
        let offset = this.elePHeight * this.currentEleNo + 'px'
        nodeDOM.style['transition'] = `transform 1s`
        nodeDOM.style['transform'] = `translate3d(0, ${offset}, 0)`
        if(this.currentEleNo < 0){
          let newNode = nodeDOM.childNodes[this.childNodesLen-1].cloneNode(true)
          nodeDOM.removeChild(nodeDOM.childNodes[this.childNodesLen-1])
          nodeDOM.insertBefore(newNode,nodeDOM.firstChild)
          nodeDOM.style['transition'] = null
          nodeDOM.style['transform'] = `translate3d(0, ${this.elePHeight+'px'}, 0)`
          this.currentEleNo += 1
        }else {
          this.currentEleNo -= 1
        }
      },this.broaddelay)
    }else {
      this.timer = setInterval(() => {
        const offset = this.elePHeight * this.currentEleNo + 'px'
        nodeDOM.style['transition'] = `transform 1s`
        nodeDOM.style['transform'] = `translate3d(0, ${offset}, 0)`
        // 检查是否滚动到最后一个子元素
        if (this.currentEleNo === this.childNodesLen) {
          let newNode = nodeDOM.childNodes[0].cloneNode(true)
          nodeDOM.removeChild(nodeDOM.childNodes[0])
          nodeDOM.appendChild(newNode)
          nodeDOM.style['transition'] = null
          nodeDOM.style['transform'] = `translate3d(0, ${this.elePHeight*(this.childNodesLen-2)+'px'}, 0)`
          this.currentEleNo -= 1
        }else {
          this.currentEleNo+=1
        }
      }, this.broaddelay)
    }


    // 监听浏览器最小化事件，当浏览器被最小化时，停止计时器，解决由于浏览器最小化导致计时器休眠的问题
    // if (document.addEventListener) {
    //   // IE
    //   document.addEventListener('msvisibilitychange', () => {
    //     clearInterval(this.timer)
    //   })
    //
    //   // FF
    //   document.addEventListener('mozvisibilitychange', () => {
    //     clearInterval(this.timer)
    //   })
    //
    //   // Chrome
    //   document.addEventListener('webkitvisibilitychange', () => {
    //     clearInterval(this.timer)
    //   })
    // }

  },

  // 销毁定时器
  distroyed (to, from, next){
    clearInterval(this.timer)
    next()
  },

  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.broadcase-info-container
  position relative
  width 100%
  background-color #fff
  h3
    padding 20px 17px 8px 20px
    position relative
    span
      font-size 14px
      color #333
      font-weight bold
      em
        &.icon
          display inline-block
          width 20px
          height 20px
          text-align center
          line-height 20px
          background-color $color-text-active
          border-radius 50%
          padding-top 2px
          position relative
          top 3px
          margin-right 5px
          .icon-style
            width 18px
            height 18px
            color #fff
      &:last-child
        font-size 12px
        padding-top 7px
        position absolute
        right 40px
        .icon-arrow
          width 12px
          height 12px
          position relative
          top 1.5px
          transform scaleX(-1)
  .broadcase-info-wrap
    width 100%
    height 80px
    position relative
    overflow hidden
    .broadcase-info-content
      width 100%
      position absolute
      top 0
      left 0
      a
        display inline-block
        width 100%
        height 80px
        font-size 14px
        color #666
        padding 0 20px

        span
          display inline-block
          width 100%
          height 36px
          line-height 1.4
          no-wrap()
          letter-spacing .6px
          &.is-level
            color #f00
      .quotation-content
        display inline-block
        width 100%
        height 80px
        font-size 12px
        color #666
        ul
          display inline-block
          width 100%
          height 100%
          li
            display inline-block
            width 180px
            height 100%
            padding 15px
            &:not(:last-child)
              span
                border-right 1px solid #EBEBEB
            &:not(:first-child)
              padding 15px 15px 15px 0
            span
              display inline-block
              width 100%
              height 25px
              line-height 25px
              font-size 12px
              &:first-child
                em
                  float right
                  margin-right 8px
              &:last-child
                display flex
                em
                  display inline-block
                  &:first-child
                    flex 1
                    max-width 120px
                    overflow hidden
                  &:last-child
                    width 25px
                    margin-left 3px
                  svg
                    margin-left 0
                    &.fall-style
                      color #3CBC98
                      transform rotateX(180deg)
                    &.rise-style
                      color #FC5A5D
              em
                &.fall-style
                  color #3CBC98
                &.rise-style
                  color #FC5A5D
                .icon-style
                  width 10px
                  height 12px
                  margin-left 50px
              a
                display inline-block
                margin 0
                padding 0
                font-size 8px
                color #333
                width 90px
                height 20px
                overflow hidden
                text-overflow ellipsis
                white-space nowrap

</style>
