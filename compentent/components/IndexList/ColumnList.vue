/*
 * @Description: 列表组件，目前主要应用于首页资讯列表和主分类下二级列表页面
 * @Author: LiuZhen
 * @Date: 2018-05-29 13:29:54
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-21 19:05:57
 */
<template>
  <section class="index-list">
    <el-tabs v-model="activeTabName" @tab-click="tabClick">
      <el-tab-pane v-for="(item, index) in indexTabList" :label="item.columnName" :name="item.columnName" :key="index">
        <list-item :isColumn="isColumn" :listItem="item.data" :isShipin="isShipin"></list-item>
        <div v-if="item.currentPage < item.totalPage" class="loading-more">
          <a href="javascript:;" @click="loadingMore(index)">查看更多</a>
        </div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script type="text/ecmascript-6">
import ListItem from '@/components/IndexList/ListItem'
import columnConfig from '@/utils/columnConfig'
export default {
  name: 'IndexList',
  data () {
    let activeTabName = this.indexTabList[this.activeIndex].columnName
    return {
      activeTabName
    }
  },
  props: {
    isColumn: {},
    isShipin: {
      type: Boolean,
      default: false,
      required: true
    },
    activeIndex: {
      type: Number,
      default: 0,
      required: true
    },
    indexTabList: {
      type: Array,
      default: () => [],
      required: true
    }
  },

  methods: {
    loadingMore (index) {
      this.$emit('loadingMore', index)
    },
    tabClick (e){
      // tab点击事件相关属性
      // const id = this.$route.params.id
      // const father = columnConfig.mapping[id]
      // let children = columnConfig.config[father]
      // children.forEach(n=>{
      //   if(this.activeTabName === n.columnName){
      //     this.$router.push(`${n.type}`)
      //   }
      // })
    }
  },
  components: {
    ListItem
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.index-list
  .loading-more
    width 100%
    height 50px
    text-align center
    line-height 50px
    background-color $color-background-d
    a
      display inline-block
      padding 0 10px
      height 100%
      font-size 13px
      color #2382EA
</style>
