/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:57
 */
<template>
<div>
  <ul class = 'article-list' v-if="data[0]">
    <li v-for="(item,index) in data" :key="index">
      <div class='article-img'>
        <!-- item.articleFrom == 1 ? imgUrl + item.articleImage : item.articleImage -->
        <img @click="enterDetail(item)" v-lazy="changeImg(item.articleImage)" :alt = "item.articleTitle"/>
      </div>
      <div class='article-info'>
        <p @click="enterDetail(item)" class='tit'>{{item.articleTitle}}</p>
        <p class='foot'>
          <span>{{item.collectDate}}</span>
          <span @click="cancel(item)" class="cencel">{{type == 1 ? '取消收藏' : '取消点赞'}}</span>
        </p>
      </div>
    </li>
  </ul>
        <div v-else class="no-data">
        <img :src="defaultImg"/>
        <p>暂无数据</p>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import axios from '@/plugins/axios'
import { handleImgAddr,randomImg } from '@/utils/utils'

export default {
  data () {
    return {
      imgUrl:'https://kgcom.oss-cn-shenzhen.aliyuncs.com/',
      defaultImg:require('../../assets/img/personal/nodata.png'),
    }
  },
  computed: {

  },
  props:{
    data:{},
    type:{},
    cancel:{}
  },
  components: {

  },
  methods:{
    changeImg(url,errUrl){
      return {
        src: handleImgAddr(url),
        error: errUrl || randomImg()
      }
    },
    handleImgAddrHandle(data){
      return handleImgAddr(data)
    },
    enterDetail(item){
      if(item.publishKind === 1){ // 文章
        this.$router.push(`/article/${item.articleId}`)
      }else { //视频
        this.$router.push(`/video/${item.articleId}`)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
.article-list
  font-size 14px
  color #333
  li
    width 100%
    height 134px
    margin-bottom 20px
    border-bottom $border
    display flex
    flex-direction row
    .article-img
      width 142px
      height 94px
      overflow hidden
      margin-right 15px
      margin-top 10px
      img
        display inline-block
        width 100%
        height 100%
        cursor pointer
    .article-info
      width 695px
      height 94px
      margin-top 10px
      display flex
      flex-direction column
      position relative
      .tit
        font-size 18px
        color #333
        cursor pointer
      .des
        font-size 14px
        color #666
        margin-top 15px
      .foot
        position absolute
        width 100%
        bottom 0px
        left 0px
        flex-row-space-between()
        font-size 12px
        color #9b9b9b
        .cencel
          cursor pointer
  li:last-child
    border 0px
    margin-bottom 0px
.no-data
  width 100%
  height 539px
  flex-colunm-center()
  text-align center
  img
    width 151px
    margin 0 auto
  p
    margin-top 30px
    font-size 14px
    color #333
</style>
