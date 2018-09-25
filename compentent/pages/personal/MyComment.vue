/*
* @Description: 个人中心页
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:57
*/
<template>
  <section id="myComment">
    <header class="comment-header">
      <span>我的评论</span>
      <span>共{{totalNumber}}条</span>
    </header>
    <section class="comment-main">
      <comment-list v-if="tableData[0]" :data="tableData" :onDelete="onDelete"/>
      <div v-else class="no-data">
        <img :src="defaultImg"/>
        <p>暂无数据</p>
      </div>
    </section>
    <div v-if="moreVisible" class='load-more' @click='loadMore'>查看更多</div>
    <div v-if="noMore" class="no-more">没有更多了</div>
  </section>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import axios from '@/plugins/axios'
  import CommentList from './CommentList'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        tableData: [], //评论列表数据
        moreVisible: false, // 加载更多按钮 visible
        page: 1, //页码
        defaultImg: require('../../assets/img/personal/nodata.png'), //没有数据占位图
        totalNumber: '0', // 评论总条数
        noMore:false
      }
    },
    computed: {
      ...mapState([
        'KGUser'
      ])
    },
    components: {
      CommentList
    },
    mounted() {
      this.getList(1)
    },
    methods: {
      getList(page) {
        const that = this;
        //我的评论列表
        this.ajax({
          url: '/userComment/getCommentAll/',
          data: {
            userId: that.KGUser.userId,
            currentPage: page
          },
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            if (res.code == 10000) {
              that.tableData = res.responseBody.data
              that.totalNumber = res.responseBody.totalNumber
              if (res.responseBody.currentPage >= res.responseBody.totalPage) {
                that.moreVisible = false
                that.noMore = true
              } else {
                that.moreVisible = true
                that.noMore = false
              }
            } else {
              that.$message({
                message: res.message,
                type: 'error'
              });
            }

          }
        })
      },
      loadMore() {
        const that = this;
        this.page += 1;
        this.ajax({
          url: '/userComment/getCommentAll/',
          data: {
            userId: that.KGUser.userId,
            currentPage: that.page
          },
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            if (res.code == 10000) {
              const data = res.responseBody.data
              if (res.responseBody.currentPage >= res.responseBody.totalPage) {
                that.moreVisible = false
                that.noMore = true
              } else {
                that.moreVisible = true
                that.noMore = false
              }
              for (var i in data) {
                that.tableData.push(data[i])
              }
            } else {
              that.$message({
                message: res.message,
                type: 'error'
              });
            }
          }
        })

        // axios({url:'/userComment/getCommentAll/',method:'post',headers:{token:that.KGUser.token},data:{userId:that.KGUser.userId,currentPage:that.page}}).then(
        //       (res) => {
        //         const data = res.data.responseBody.data
        //         if(res.data.responseBody.currentPage >= res.data.responseBody.totalPage) {
        //           that.moreVisible = false
        //         }else{
        //           that.moreVisible = true
        //         }
        //         for(var i in data){
        //           that.tableData.push(data[i])
        //         }
        //       }
        // )
      },
      onDelete(item) {
        const that = this;
        //删除评论
        this.ajax({
          url: '/userComment/deleteComment/',
          data: {
            commentId: item.commentId
          },
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            if (res.code == 10000) {
              for (var i in that.tableData) {
                if (that.tableData[i].commentId == item.commentId) {
                  that.tableData.splice(i, 1)
                }
              }
              that.$message({
                message: '删除成功',
                type: 'success'
              });
            } else {
              that.$message({
                message: res.message,
                type: 'error'
              });
            }
          }
        })
        //   axios({url:'/userComment/deleteComment/',method:'post',headers:{token:that.KGUser.token},data:{commentId:item.commentId}}).then(
        //       (res) => {
        //         for(var i in that.tableData){
        //           if(that.tableData[i].commentId == item.commentId){
        //               that.tableData.splice(i,1)
        //           }
        //         }
        //         that.$message({
        //             message: '删除成功',
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
  #myComment
    .comment-header
      personal-main-header()
      span:nth-child(1)
        padding-bottom 15px
        border-bottom 2px solid $color-text-active
    .comment-main
      width 100%
      background #fff
      padding 30px 35px
    .load-more
      width 100%
      height 50px
      line-height 50px
      text-align center
      background #fff
      color $color-text-active
      margin-top 10px
      cursor pointer
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
    .no-more
      padding 5px
      text-align center
      font-size 14px
      color #666
</style>
