/*
 * @Description: 热门关键词列表组件
 * @Author: LiuZhen
 * @Date: 2018-06-02 11:20:58
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-15 11:00:30
 */
<template>
  <ul class="hot-keywords">
    <li v-for="(item,index) in hotKeywordsList" :key="index">
      <a :href="allUrl(item.keywordLink)" target="_blank">{{item[keyName]}}</a>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'

export default {
  name: 'HotKeywords',
  data () {
    return {
    }
  },
  methods:{
    allUrl(url){
      if(this.$route.name.indexOf('search')>-1){
        return url
      }else {
        if(url.startsWith('http://') || url.startsWith('https://')){
          return url
        }else {
          return `http://${url}`
        }
      }
    }
  },
  props: {
    hotKeywordsList: {
      type: Array,
      default: () => []
    },

    // 自定义传入的keyName和keyUrlName
    keyName: {
      type: String,
      default: 'keywordDesc'
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.hot-keywords
  width: 100%;
  min-height: 220px;
  overflow: hidden;
  padding: 10px;
  background-color: #fff;
  word-wrap: break-word;
  font-size 0
  li
    display inline-block
    margin-right 10px
    margin-bottom 10px
    max-width 100%
    overflow hidden
    word-wrap: normal
    a
      display inline-block
      padding 7px
      width 100%
      height 100%
      font-size 13px
      color #747474
      border 1px solid #E6E6E6
      border-radius 14px
      overflow hidden
      word-wrap normal
      text-overflow ellipsis
      &:hover
        color #2382EA
        border-color #2382EA
</style>
