/*
 * @Description: 百科词条列表组件
 * @Author: LiuZhen
 * @Date: 2018-06-02 10:01:12
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-19 13:56:34
 */
<template>
  <ul class="encyclopedia">
    <li v-for="(item,index) in showList" :key="index">
      <a :href="'article/' + item.articleId">
        <p class="encyclopedia-title" :title="item.articleTitle">{{item.articleTitle}}</p>
        <p class="encyclopedia-desc" :title="item.articleDescription">{{item.articleDescription}}</p>
      </a>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'

export default {
  name: 'Encyclopedia',
  data () {
    return {
    }
  },
  computed:{
    'showList'(){
      if(this.maxShow){
        return this.encyclopediaList.slice(0,parseInt(this.maxShow))
      }else {
        return this.encyclopediaList
      }
    }
  },

  props: {
    encyclopediaList: {
      type: Array,
      default: () => []
    },
    maxShow:''
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.encyclopedia
  width 100%
  height auto
  li
    padding 19px 16px
    &:nth-child(odd)
      background-color #EBF5FD
    &:nth-child(even)
      background-color #F3F8FC
    &:hover
      background-color #E1F1FF
    a
      display inline-block
      width 100%
      height 100%
      &:hover
        color #333
      p.encyclopedia-title
        font-size 15px
        font-weight bold
        color #121212
        margin-bottom 16px
        height 16px
        no-wrap(1)
      p.encyclopedia-desc
        font-size 13px
        line-height 22px
        no-wrap()
</style>
