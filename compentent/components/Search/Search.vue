/*
 * @Description: 搜索浮层组件
 * @Author: LiuZhen
 * @Date: 2018-06-13 10:46:17
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-24 15:51:28
 */
<template>
  <transition name="show">
    <section class="search-ele-container" >
      <h1>
        <span @click="closeSearch"><svg-icon iconClass="delete" class="icon-style"></svg-icon></span>
      </h1>
      <div class="search-ele-main">
        <div class="search-input">
          <el-input v-model="keywords" placeholder="请输入文章或视频标题" ref="searchInput"></el-input>
          <el-button type="primary" round @click="handleSearch"><svg-icon iconClass="search" class="icon-style"></svg-icon></el-button>
        </div>
        <div class="hot-search">
          <h3>热门搜索</h3>
          <ul>
            <li v-for="(keyword,wordsIndex) in hotKeywordsList" :key="wordsIndex">
              <span @click="clickSearch(keyword.searchwordDesc)">{{keyword.searchwordDesc}}</span>
            </li>
          </ul>
        </div>
        <div class="near-search" v-if="this.getLocalSearchLists">
          <h3>
            <el-row>
              <el-col :span="12"><h3>最近搜索</h3></el-col>
              <el-col :span="12"><div class="clear" @click="clearLocalWords">清空</div></el-col>
            </el-row>
          </h3>
          <ul>
            <li v-for="(localkey,localkeyIndex) in localKeywordsList" :key="localkeyIndex">
              <span @click="clickSearch(localkey)">{{localkey}}</span>
            </li>
          </ul>
        </div>
        <div class="search-banner" v-if="resultBannerList.length">
          <el-row>
            <el-col :span="8" class="banner-container" v-for="(item,index) in resultBannerList" :key="index">
              <a :href="item.adverLink" target="_blank">
                <img v-lazy="handleImgAddress(item.imageAddress)" alt="">
              </a>
            </el-col>
          </el-row>
        </div>
      </div>
    </section>
  </transition>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { mapState, mapMutations } from 'vuex'
import { handleWebStorage } from '@/utils/utils'
import { setTimeout } from 'timers';
import { handleImgMixin } from '@/utils/mixins'

export default {
  name: 'Search',
  mixins: [handleImgMixin],
  data () {
    return {
      keywords: '',
      hotKeywordsList: [],
      localKeywordsList: [],
      resultBannerList: [],
      localSearchKeyList:[],
      searchValue:[]
    }
  },

  props: {
    searchBannerList: {
      type: Array,
      default: () => []
    },

    mostShowNum: {
      type: Number,
      default: 3
    }
  },

  created () {
    this.resultBannerList = this.searchBannerList.filter((item) => {
      return item.imagePos === 31
    })

    if (this.resultBannerList.length > this.mostShowNum) {
      this.resultBannerList = this.resultBannerList.slice(0, this.mostShowNum)
    }

    if (process.client) {
      // 获取热门搜索关键字
      axios.post('/hotsearch/selectHotAll', {}).then(({ data }) => {
        this.hotKeywordsList = data.code === '10000' ? data.responseBody.data : []
      })

      // 获取本地搜索关键字
      this.getLocalSearchWordsList()
    }
  },

  computed: {
    ...mapState([
      'searchEleStatus'
    ]),
    getLocalSearchLists(){
      const lists = handleWebStorage.getLocalData('localSearchKeyList')
      if(lists.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    ...mapMutations([
      'SET_SEARCH_STATUS'
    ]),

    // 关闭浮层
    closeSearch () {
      this.SET_SEARCH_STATUS(false)
    },

    // 获取本地搜索关键字
    getLocalSearchWordsList () {
      if (handleWebStorage.getLocalData('localSearchKeyList')) {
        this.localKeywordsList = JSON.parse(handleWebStorage.getLocalData('localSearchKeyList'))
      }
    },

    // 清空本地存储的搜索关键字
    clearLocalWords () {
      handleWebStorage.removeLocalData('localSearchKeyList')
      this.localKeywordsList = []
    },

    // 执行搜索
    handleSearch () {
      const keywords = this.keywords.replace(/\s+/g,'')
      if (!keywords) {
        this.$message({
          message: '请输入搜索内容！',
          type: 'warning'
        })
        return
      }
      let tmpData = []
      if (handleWebStorage.getLocalData('localSearchKeyList')){
        tmpData = JSON.parse(handleWebStorage.getLocalData('localSearchKeyList'))
      }
      if(tmpData.indexOf(this.keywords) === -1){
        this.localKeywordsList.unshift({
          keywordDesc: this.keywords,
          keywordLink: `/search?keywords=${this.keywords}`
        })
        tmpData.unshift(this.keywords)
        if(tmpData.length > 20) {
          this.localKeywordsList.length = 20
          tmpData.length = 20
        }
        handleWebStorage.setLocalData('localSearchKeyList', JSON.stringify(tmpData))
      }
      this.closeSearch()
      this.$router.push(`/search?keywords=${this.keywords}`)
    },

    // 点击搜索关键字
    clickSearch (key) {
      this.keywords = key
      this.handleSearch()
    }
  },

  watch: {
    searchEleStatus (newVal) {
      if (newVal) {
        // 清空上次的搜索词
        this.keywords = ''

        // 打开搜索框时输入框获取焦点
        try {
          setTimeout(() => {
            this.$refs.searchInput.focus()
          }, 200)
        } catch (e) {
          throw new Error(e)
        }
      }
    }
  },

  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.el-button--primary
  background-color #2382EA
.search-ele-container
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color rgba(255, 255, 255, .98)
  padding 40px
  z-index 1001
  &.show-enter-active, &.show-leave-active
    transition: all 0.2s
  &.show-enter
    transform: scale(0.4, 0.4)
  &.show-leave-to
    transform: scale(0, 0)
  h1
    text-align right
    .icon-style
      width 28px
      height 28px
      color #E6E6E6
      border-radius 50%
      cursor pointer
  .search-ele-main
    width 640px
    height 300px
    margin 25px auto 0 auto
    .search-input
      display flex
      width 600px
      height 40px
      border-left 1px solid #e6e6e6
      border-top 1px solid #e6e6e6
      border-bottom 1px solid #e6e6e6
      border-top-left-radius 20px
      border-bottom-left-radius 20px
      border-top-right-radius 0
      border-bottom-right-radius 0
      position relative
      margin-bottom 25px
      input
        width 580px
        height 38px
        border none
        margin-left 15px
        background-color transparent
      button
        position absolute
        top -1px
        right -40px
        width 80px
        height 40px
        .icon-style
          position relative
          top -1px
        &:hover
          background-color #2b8cf5
    .hot-search,
    .near-search
      margin-bottom 25px
      h3
        font-size 16px
        color $color-text-active
        font-weight normal
        margin-bottom 20px
      ul
        width 100%
        li
          display inline-block
          margin-right 10px
          margin-bottom 10px
          border 1px solid #E6E6E6
          border-radius 20px
          &:hover
            border 1px solid #2382EA
            color #2382EA
          span
            display inline-block
            width 148px
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
            height 100%
            padding 0px 17px
            padding-top 4px
            font-size 14px
            line-height 22px
            color #747474
            cursor pointer
            &:hover
              color #2382EA

    .near-search
      h3
        margin-bottom 10px
        .clear
          text-align right
          font-size 13px
          color #747474
          cursor pointer
    .search-banner
      .banner-container
        width 200px
        height 134px
        &:not(:last-child)
          margin-right 16px
        img
          width 100%
          height 100%
</style>
