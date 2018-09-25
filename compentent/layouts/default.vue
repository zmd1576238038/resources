/*
 * @Description: 默认模板页，用于大多数页面布局
 * @Author: LiuZhen
 * @Date: 2018-05-29 09:27:23
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 16:23:32
 */
<template>
  <section>
    <Header></Header>
    <nuxt/>
    <Footer :showArea="showArea"></Footer>
    <fixed-function></fixed-function>
    <Feedback></Feedback>
    <Search v-if="searchEleStatus" :searchBannerList="searchBannerList"></Search>
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FixedFunction from '@/components/FixedFunction/FixedFunction'
import Feedback from '@/components/Feedback/Feedback'
import axios from '@/plugins/axios'
import Search from '@/components/Search/Search'
import $http from '@/assets/js/request'
import { mapState, mapMutations } from 'vuex'
Vue.use($http)

export default {
  name: 'default',
  data () {
    return {
      showArea: 'index',
      searchBannerList:[]
    }
  },
  async asyncData({store,redirect,error}){
    let searchBannerList = await Promise(axios.post('/siteimageapi/listsiteimage', { "navigator_pos":3 }))
    return {
      searchBannerList: searchBannerList.data.code === '10000' ? searchBannerList.data.responseBody : [],
    }
  },
  computed: {
    ...mapState([
      'searchEleStatus'
    ])
  },
  mounted(){
    this.showArea = this.$route.fullPath === '/' ? 'index' : 'inSidePage'
  },
  watch: {
    // 监听路由变化
    $route () {
      this.showArea = this.$route.fullPath === '/' ? 'index' : 'inSidePage'
    }
  },

  components: {
    Header,
    Footer,
    FixedFunction,
    Feedback,
    Search,
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  body
    min-width 1400px


</style>
