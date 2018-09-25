/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:57
 */
<template>
  <section class = 'collect-main'>
    <el-tabs v-model = "activeTabName"  @tab-click="handleClick">
      <el-tab-pane label = "我的收藏" name = "0" ><article-list :data="collectData" :type="1" :cancel="cancel"/></el-tab-pane>
      <el-tab-pane label = "我的点赞" name = "1" ><article-list :data="goodsData" :type="2" :cancel="cancel"/></el-tab-pane>
    </el-tabs>
    <span class = 'total'>共{{activeTabName == 0 ? collectTotal : goodsTotal}}条</span>
    <div v-if="activeTabName == 0 ? collectLoadMore : goodsLoadMore" class = 'load-more' @click="loadMore">查看更多</div>
    <div v-if="activeTabName == 0 ? !collectLoadMore && collectData.length>0 : !goodsLoadMore && goodsData.length>0" class="no-more">没有更多了</div>
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import axios from '@/plugins/axios'
import ArticleList from './ArticleList'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      activeTabName:'0',
      collectData:[],//收藏列表数据
      collectTotal:0,//收藏总数
      collectLoadMore:false,//收藏加载更多
      goodsData:[],//点赞列表数据
      goodsLoadMore:false,//点赞加载更多
      goodsTotal:0,//点赞总数
      page:1,//收藏页数
      page2:1//点赞页数
    }
  },
  components: {
    ArticleList
  },
  computed: {
    ...mapState([
      'KGUser'
    ])
  },
  mounted(){
    this.getColletct(1,1)
  },
  methods:{
    getColletct(page,operType){
          const that = this;
          const getColletct = {
                        "userId":this.KGUser.userId,
                        "currentPage":page,
                        "operType":operType
          }
        //我的点赞、收藏列表
         this.ajax({
                  url: '/usercollect/getCollectAll/',
                  data: getColletct,
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (res) => {
                    if(res.code == 10000){
                        if(operType === 1){
                          that.collectData = res.responseBody.data
                          that.collectTotal = res.responseBody.totalNumber
                          if(res.responseBody.currentPage >= res.responseBody.totalPage){
                            that.collectLoadMore = false
                          }else{
                            that.collectLoadMore = true
                          }
                        }else{
                          that.goodsData = res.responseBody.data
                          that.goodsTotal = res.responseBody.totalNumber
                          if(res.responseBody.currentPage >= res.responseBody.totalPage){
                            that.goodsLoadMore = false
                          }else{
                            that.goodsLoadMore = true
                          }
                        }
                    }else{
                        that.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                  }
                })
        // axios({url:'/usercollect/getCollectAll/',method:'post',headers:{token:that.KGUser.token},data:getColletct}).then(
        //     (res) => {
        //       if(operType === 1){
        //         that.collectData = res.data.responseBody.data
        //         that.collectTotal = res.data.responseBody.totalNumber
        //         if(res.data.responseBody.currentPage >= res.data.responseBody.totalPage){
        //           that.collectLoadMore = false
        //         }else{
        //           that.collectLoadMore = true
        //         }
        //       }else{
        //         that.goodsData = res.data.responseBody.data
        //         that.goodsTotal = res.data.responseBody.totalNumber
        //         if(res.data.responseBody.currentPage >= res.data.responseBody.totalPage){
        //           that.goodsLoadMore = false
        //         }else{
        //           that.goodsLoadMore = true
        //         }
        //       }
        //     }
        // )
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
      this.page = 1;
      this.page2 = 1;
      if(tab.name == 0){
        this.getColletct(1,1)
      }else{
        this.getColletct(1,2)
      }
    },
    loadMore(){
          const that = this;
          // let currentPage = this.activeTabName == 0 ? this.page : this.page2;
          // currentPage = currentPage++
          if(this.activeTabName == 0){
            this.page += 1
          }else{
            this.page2 +=1
          }
          const getColletct = {
                        "userId":this.KGUser.userId,
                        "currentPage":this.activeTabName == 0 ? this.page : this.page2,
                        "operType":this.activeTabName == 0 ? 1 : 2
          }
        //我的点赞、收藏列表
          this.ajax({
                  url: '/usercollect/getCollectAll/',
                  data: getColletct,
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (res) => {
                    if(res.code == 10000){
                        if(that.activeTabName == 0){
                          const data = res.responseBody.data
                          for(var i in data){
                            that.collectData.push(data[i])
                          }
                          that.collectTotal = res.responseBody.totalNumber
                          if(res.responseBody.currentPage >= res.responseBody.totalPage){
                            that.collectLoadMore = false
                          }else{
                            that.collectLoadMore = true
                          }
                        }else{
                          const data = res.responseBody.data
                          for(var i in data){
                            that.goodsData.push(data[i])
                          }
                          that.goodsTotal = res.responseBody.totalNumber
                          if(res.responseBody.currentPage >= res.responseBody.totalPage){
                            that.goodsLoadMore = false
                          }else{
                            that.goodsLoadMore = true
                          }
                        }
                    }else{
                       that.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                  }
                })
        // axios({url:'/usercollect/getCollectAll/',method:'post',headers:{token:that.KGUser.token},data:getColletct}).then(
        //     (res) => {
        //       if(that.activeTabName == 0){
        //         const data = res.data.responseBody.data
        //         console.log('data',data)
        //         for(var i in data){
        //           that.collectData.push(data[i])
        //         }
        //         that.collectTotal = res.data.responseBody.totalNumber
        //         if(res.data.responseBody.currentPage >= res.data.responseBody.totalPage){
        //           that.collectLoadMore = false
        //         }else{
        //           that.collectLoadMore = true
        //         }
        //       }else{
        //         const data = res.data.responseBody.data
        //         for(var i in data){
        //           that.goodsData.push(data[i])
        //         }
        //         that.goodsTotal = res.data.responseBody.totalNumber
        //         if(res.data.responseBody.currentPage >= res.data.responseBody.totalPage){
        //           that.goodsLoadMore = false
        //         }else{
        //           that.goodsLoadMore = true
        //         }
        //       }
        //     }
        // )
    },
    cancel(item){
        const that = this;
        const operType = this.activeTabName == 0 ? 1 : 2;
        const list = {
                "operType":operType,
                "articleId":item.articleId,
                "userId":this.KGUser.userId,
        }
        const smg = operType == 1? '取消收藏成功' : '取消点赞成功'
        //取消收藏、取消点赞
               this.ajax({
                  url: '/usercollect/deleteCollect',
                  data: list,
                  headers: {
                    token:that.KGUser.token
                  },
                  success:  (res) => {
                    if(res.code == 10000){
                            if(operType == 1){
                              for(var i in that.collectData){
                                if(that.collectData[i].articleId == item.articleId){
                                    that.collectData.splice(i,1)
                                }
                              }
                              that.collectTotal -= 1
                            }else{
                              that.goodsTotal -= 1
                              for(var i in that.goodsData){
                                if(that.goodsData[i].articleId == item.articleId){
                                    that.goodsData.splice(i,1)
                                }
                              }
                            }

                            that.$message({
                                message: smg,
                                type: 'success'
                            });
                    }else{
                        that.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }

                  }
                })
      //   axios({url:'/usercollect/deleteCollect',method:'post',headers:{token:that.KGUser.token},data:list}).then(
      //       (res) => {
      //         if(operType == 1){
      //           for(var i in that.collectData){
      //             if(that.collectData[i].articleId == item.articleId){
      //                 that.collectData.splice(i,1)
      //             }
      //           }
      //           that.collectTotal -= 1
      //         }else{
      //           that.goodsTotal -= 1
      //            for(var i in that.goodsData){
      //             if(that.goodsData[i].articleId == item.articleId){
      //                 that.goodsData.splice(i,1)
      //             }
      //           }
      //         }

      //         that.$message({
      //             message: smg,
      //             type: 'success'
      //         });
      //       }
      // )
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'
.collect-main
  position relative
  .total
    position absolute
    right 0px
    top 15px
    font-size 12px
    color #666
  .el-tabs__content
    background #fff
    padding 30px
  .load-more
    width 100%
    height 50px
    line-height 50px
    text-align center
    background #fff
    color $color-text-active
    margin-top 10px
    cursor pointer
  .no-more
    width 100%
    text-align center
    font-size 18px
    color #999
    margin-top 20px
</style>
