/*
 * @Description: 轮播组件，支持多种轮播方式
 * @Author: LiuZhen
 * @Date: 2018-05-29 10:07:45
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-20 14:28:54
 */
<template>
  <el-carousel class="index-carousel" :height="height" :autoplay="autoplay" indicator-position="none" :interval="interval">
    <el-carousel-item v-for="(item,index) in carouselList" :key="index">
      <a :href="bannerItem.imageType===1?(bannerItem.articleType===1?`article/${bannerItem.imageDetail}`:`video/${bannerItem.imageDetail}`):bannerItem.imageDetail" target="_blank" v-for="(bannerItem,bannerIndex) in item" :key="bannerIndex">
        <img v-lazy="changeImg(bannerItem.imageAddress)" alt="">
        <p class="banner-title" v-if="bannerItem.imageType===1">{{bannerItem.articleTitle}}</p>
        <img class="adver" v-if="bannerItem.imageType===2" src="~/assets/img/adv.png" :alt="bannerItem.adverTitle || ''">
      </a>
    </el-carousel-item>
  </el-carousel>
</template>

<script type="text/ecmascript-6">
import { randomImg, handleImgAddr } from "@/utils/utils";

export default {
  name: 'Carousel',
  data () {
    return {
      carouselList: [],
      gourpNum: 0
    }
  },

  props: {
    bannerList: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: '216px'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 7000
    }
  },
  mounted(){
  },

  created () {
    let tmpList = []

    for (let i = 0; i < this.bannerList.length; i++) {
      if (this.bannerList[i].imagePos === 11) {
        tmpList.push(this.bannerList[i])
      
      }
    }
    // 如果结果数量大于12，则只截取前12条数据
    if (tmpList.length > 12) {
      tmpList = tmpList.slice(0, 12)
    }

    // 获取分组数
    this.groupNum = Math.ceil(tmpList.length / 4)
    let inSideList = []

    switch (this.groupNum) {
      case 1:
        // 当前组不够4张banner时添加占位图
        while (tmpList.length < 4) {
          tmpList.push({
            imageAddress: 'index_carsoule_bitmap.png',
            articleTitle: '',
            url: '/'
          })
        }
        // 将当前tmpList推入结果数组
        this.carouselList.push(tmpList)
        break
      case 2:
        // 当前组不够8张banner时添加占位图
        while (tmpList.length < 8) {
          tmpList.push({
            imageAddress: 'index_carsoule_bitmap.png',
            articleTitle: '',
            url: '/'
          })
        }

        // 将当前tmpList推入结果数组
        inSideList = []

        for (let i = 0; i < tmpList.length; i++) {
          if (i < 4) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        inSideList = []

        for (let i = 4; i < tmpList.length; i++) {
          if (i < 8) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        break
      case 3:
        // 当前组不够8张banner时添加占位图
        while (tmpList.length < 12) {
          tmpList.push({
            imageAddress: 'index_carsoule_bitmap.png',
            articleTitle: '',
            url: '/'
          })
        }

        // 将当前tmpList推入结果数组
        inSideList = []

        for (let i = 0; i < tmpList.length; i++) {
          if (i < 4) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        inSideList = []

        for (let i = 4; i < tmpList.length; i++) {
          if (i < 8) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        inSideList = []

        for (let i = 8; i < tmpList.length; i++) {
          if (i < 12) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        break
    }
  },

  methods: {
    changeImg(url,errUrl){
      return {
        src: handleImgAddr(url),
        error: errUrl || randomImg()
      }
    },
    bannerJump (url) {
      if (!url) {
        return
      }

      console.log(url)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.index-carousel
  background-color #fff
  margin-bottom: 16px
  a
    display inline-block
    position relative
    overflow hidden
    &:not(:last-child)
      width 314px
      height 100%
      margin-right 1px
    img
      width 100%
      height 100%
      transition: all 1s;
      &.adver
        width 32px
        height 21px
        position absolute
        bottom 0
        right 0
    &:last-child
      width 315px
      height 100%
    p.banner-title
      position absolute
      left 0
      bottom 0
      padding 54px 10px 5px 10px
      width 100%
      color #fff
      display block
      font-size 16px
      // background-image: -webkit-gradient(linear,left bottom,left top,from(#000),to(transparent))
      background-image: linear-gradient(0deg,#000,transparent)
      line-height 26px
      height 112px
      no-wrap()
  a:hover img
    transform: scale(1.05)
  .el-carousel__item.is-active
    z-index 0
</style>
