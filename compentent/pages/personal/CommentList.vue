/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:57
 */
<template>
  <ul class = 'comment-list'>
    <li  v-for="(t,index) in data" :key="index" class="martop20">
      <div class="comment">
        <span  class="desc">
          {{t.commentDesc}}
        </span>
         <!-- v-if='t.displayStatus == 0' -->
        <div class='hideFt' v-if='t.displayStatus == 0'>
            <span class="color9b9b">被隐藏</span>
            <el-tooltip  effect="dark" content="也许是您的评论内容不太适合展示出来，如有疑问，请联系客服" placement="top">
              <svg-icon   iconClass="point" class="svg-icon color9b9b"></svg-icon>
            </el-tooltip>
        </div>
      </div>
      <p>
        <span>
          <span class = 'time'>{{t.commentDate}}</span>
          <span>
            评论了
           <nuxt-link :to="concatUrl(t.publishKind == 1 ? 'article' : 'video', t.articleId)" target="_blank" class = 'tit'>《{{t.articleTitle}}》</nuxt-link>
          </span>
        </span>
        <span @click="onDelete(t)"><svg-icon iconClass="alter_delete" class="svg-icon" >删除</svg-icon></span>
      </p>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import axios from '@/plugins/axios'
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { mapState } from 'vuex'
import { concatUrlMixin } from '@/utils/mixins'

export default {
  data () {
    return {

    }
  },
  mixins: [concatUrlMixin],
  components: {
    SvgIcon
  },
  computed: {
    ...mapState([
      'KGUser'
    ])
  },
  mounted(){
    // console.log('data',this.data)
  },
  props:{
    data:{},
    onDelete:{}
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.color9b9b
  color #9b9b9b
.comment-list
  width 100%
  font-size 14px
  color #333
  li
    margin-bottom 30px
    border-bottom $border
    .hideFt
      display flex
      svg
        width 15px
        height 15px
        margin-left 5px
        cursor pointer
    .comment
      display flex
      flex-direction row
      justify-content space-between
    .desc
      width 500px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    p:nth-child(2)
      flex-row-space-between()
      margin-top 19px
      margin-bottom 22px
      .time
        font-size 12px
        color #747474
        margin-right 30px
      .tit
        color #1373DB
        cursor pointer
      .svg-icon
        color #9b9b9b
        cursor pointer
      .svg-icon:hover
        color $color-text-red
  li:last-child
    border 0px
    margin-bottom 0px
</style>
