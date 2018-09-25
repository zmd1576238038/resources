/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:10
 */
<template>
  <section class = 'tiValue'>
    <header class = 'tv-header'>
      <section>我的可用氪金：<span class = 'balance'>{{kgBalance.balance}}<span class="kg">KG</span></span></section>
      <section class = 'header-r'>
        <div>冻结氪金：<span class = 'freeze'>{{kgBalance.frozenBalance}}<span class="kg">KG</span></span></div>
      </section>
    </header>
    <section class = 'tv-state'>
      <div class = 'block'>
          <p>{{kgBalance.todayIncome}}KG</p>
          <p>今日获得氪金</p>
      </div>
      <div class = 'block'>
          <p>{{kgBalance.reduce}}KG</p>
          <p>今日消耗</p>
      </div>
      <div class = 'block'>
          <p>{{kgBalance.beforeIncome}}KG</p>
          <p>昨日获得氪金</p>
      </div>
      <div class = 'block'>
          <p>{{kgBalance.income}}KG</p>
          <p>累计获得氪金</p>
      </div>
    </section>
    <div class = 'table-list'>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="0">
            <value-list :lists = "kgList" :type = "2"/>
          </el-tab-pane>
          <el-tab-pane label="奖励" name="1">
            <value-list :lists = "kgList" :type = "2"/>
          </el-tab-pane>
          <el-tab-pane label="进贡" name="2">
            <value-list :lists = "kgList" :type = "2"/>
          </el-tab-pane>
        </el-tabs>
        <div class = 'date-list'>
          <el-date-picker
            v-model="value7"
            type="daterange"
            align="right"
            :unlink-panels = "true"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            size = 'small'
            @change = "dateChange"
            >
          </el-date-picker>
          <el-button type = 'primary' size = 'small' @click = 'searchData'>查询</el-button>
        </div>
    </div>
    <div v-if="kgMoreVisible" class = 'load-more' @click="loadMore">查看更多</div>
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import { handleRequestParams } from '@/utils/utils'
import axios from '@/plugins/axios'
import state from '@/store/state'
import { mapState, mapMutations } from 'vuex'
import ValueList from './ValueList'

export default {
  data () {
    return {
      res:'',
      activeName: '0',
      tableData:[{}],
      pickerOptions: {
        disabledDate(time) {
            return time.getTime() > Date.now();
          },
      },
      valueLists:[{}],
      value7:'',
      page:1,
      startTime:"",
      endTime:""
    }
  },
  components: {
    ValueList
  },
  computed: {
    ...mapState([
      'kgBalance',//获取 氪金数据 state
      'kgList', //获取 氪金流水 state
      'KGUser', //获取 用户数据
      'kgMoreVisible' //氪金加载更多按钮
    ])
  },
  mounted(){

  },
  methods: {
    ...mapMutations([
      'SET_KGLIST', //设置 氪金流水 state
      'NEWKGLIST_LOADING_MORE', //加载跟多 mutation
      'SET_KGMORE_VISIBLE' //设置加载更多按钮 state
    ]),
    //切换流水类型
    handleClick(tab, event){
      this.activeName = tab.index;
      this.page = 1;
      this.getTableData(tab.index,1)
    },
    handleCurrentChange(){},
    searchData(){
        if(this.startTime == '' || this.endTime == ''){
          this.$message({
            type:"warning",
            message:'筛选日期不能为空'
          })
          return
        }
        this.page = 1;
        this.getTableData(this.activeName,1)
    },
    dateChange(val){
      if(val == null){
          this.startTime = '';
          this.endTime = ''
          return
      }
      function getNowFormatDate(date) {
          var seperator1 = "/";
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var strDate = date.getDate();
          if (month >= 1 && month <= 9) {
              month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }
          var currentdate = year + seperator1 + month + seperator1 + strDate;
          return currentdate;
      }
      this.startTime = getNowFormatDate(val[0]);
      this.endTime = getNowFormatDate(val[1]);
    },
    getTableData(index,page){
      const list = this.postList(index,page);
      const that = this;
      this.ajax({
          url: '/accountFlow/selectUserTxbflow',
          data: list,
          headers: {
            token:that.KGUser.token
          },
          success:(res) => {
            if(res.code == 10000){
                if(res.responseBody.currentPage >= res.responseBody.totalPage) {
                  that.SET_KGMORE_VISIBLE(false)
                }else{
                  that.SET_KGMORE_VISIBLE(true)
                }
                that.SET_KGLIST(res.responseBody.data)
            }else{
                  that.$message({
                      message: res.message,
                      type: 'error'
                  });
            }
          }
      })
      // axios({url:'/accountFlow/selectUserTxbflow',method:'post',headers:{token:that.KGUser.token},data:list}).then(
      //   (res) => {
      //      if(res.data.responseBody.currentPage >= res.data.responseBody.totalPage) {
      //       that.SET_KGMORE_VISIBLE(false)
      //     }else{
      //       that.SET_KGMORE_VISIBLE(true)
      //     }
      //     that.SET_KGLIST(res.data.responseBody.data)
      //   }
      // )
    },
    loadMore(){
      this.page += 1;
      const list = this.postList(this.activeName,this.page);
      const that = this;
      this.ajax({
          url: '/accountFlow/selectUserTxbflow',
          data: list,
          headers: {
            token:that.KGUser.token
          },
          success:(res) => {
            if(res.code == 10000){
               if(res.responseBody.currentPage >= res.responseBody.totalPage) {
                  that.SET_KGMORE_VISIBLE(false)
                }else{
                  that.SET_KGMORE_VISIBLE(true)
                }
                that.NEWKGLIST_LOADING_MORE(res.responseBody.data)
            }else{
                  that.$message({
                      message: res.message,
                      type: 'error'
                  });
            }
          }
      })
      // axios({url:'/accountFlow/selectUserTxbflow',method:'post',headers:{token:that.KGUser.token},data:list}).then(
      //   (res) => {
      //     if(res.data.responseBody.currentPage >= res.data.responseBody.totalPage) {
      //       that.SET_KGMORE_VISIBLE(false)
      //     }else{
      //       that.SET_KGMORE_VISIBLE(true)
      //     }
      //     that.NEWKGLIST_LOADING_MORE(res.data.responseBody.data)
      //   }
      // )
    },
    postList(index,page){
        let list = null
        switch(index){
                  case '0':
            list = {
                  "userId":this.KGUser.userId,
                  "currentPage":page
              }
            break;
            case '1':
              list = {
                  "userId":this.KGUser.userId,
                  "Type":1,
                  "currentPage":page
              }
            break;
            case '2':
            list = {
                  "userId":this.KGUser.userId,
                  "Type":2,
                  "currentPage":page
              }
            break;
            default:
        }
          if(this.startTime  != "" && this.endTime != ""){
            list.startTime  = this.startTime
            list.endTime  = this.endTime
          }
          return list
    }
  },

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.kg
  font-size 16px
.tiValue
  width 100%
  background #fff
  padding 0px 30px 30px 38px
  .tv-header
    height 90px
    line-height 90px
    display flex
    flex-direction row
    justify-content space-between
    font-size 14px
    border-bottom $border
    color #666
    .header-r
      display flex
      flex-direction row
      .line
        margin 0px 16px
    .balance,.freeze
      font-size 24px
      color $color-text-active
    .freeze
      color #666
      margin-right 32px
  .tv-state
    width 100%
    padding 30px 0px
    display flex
    flex-direction row
    justify-content space-between

    .block
      width 210px
      height 110px
      text-align center
      display flex
      flex-direction column
      justify-content center
      background rgba(255,255,255,1);
      box-shadow 4px 15px 8px rgba(229,227,227,0.3);
      cursor pointer
      p
        margin 0 auto
        line-height 1.5rem
      p:nth-child(1)
        color #333
        font-size 16px
      p:nth-child(2)
        color #666
        font-size 14px
    .block:hover
      background $color-text-active
    .block:hover p
      color #fff
  .table-list
    position relative
    .date-list
      position absolute
      right 0px
      top 0px
      .el-range-editor--small.el-input__inner
        margin-right 10px
      .el-date-editor .el-range-separator
        padding 0px
  .load-more
    width 100%
    height 50px
    line-height 50px
    text-align center
    background #f5f5f5
    color $color-text-active
    margin-top 10px
    cursor pointer
</style>
