/*
* @Description: 个人中心页
* @Author: cb
* @Date: 2018-05-31
* @Last Modified time: 2018-05-31 14:01:10
*/
<template>
  <section class='tiValue'>
    <header class='tv-header'>
      <section>我的可用钛值：<span class='balance'>{{tvBalance.balance}}<span class="tv">TV</span></span></section>
      <section class='header-r'>
        <div>冻结钛值：<span class='freeze'>{{tvBalance.frozenBalance}}<span class="tv">TV</span></span></div>
        <div>
          <!--<span class='shift' @click="shift">转入</span>-->
          <!--<span class='line'>|</span>-->
          <span class='roll-out' @click='rollOutHandle'>转出</span>
        </div>
      </section>
    </header>
    <section class='tv-state'>
      <div class='block'>
        <p>{{tvBalance.todayIncome}}TV</p>
        <p>今日获得钛值</p>
      </div>
      <div class='block'>
        <p>{{tvBalance.reduce}}TV</p>
        <p>今日消耗</p>
      </div>
      <div class='block'>
        <p>{{tvBalance.beforeIncome}}TV</p>
        <p>昨日获得钛值</p>
      </div>
      <div class='block'>
        <p>{{tvBalance.income}}TV</p>
        <p>累计获得钛值</p>
      </div>
    </section>
    <div class='table-list'>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0">
          <value-list :lists="tvList" :type="1"/>
        </el-tab-pane>
        <!-- <el-tab-pane label="奖励" name="1">
          <value-list :lists="tvList" :type="1"/>
        </el-tab-pane>
        <el-tab-pane label="打赏" name="2">
          <value-list :lists="tvList" :type="1"/>
        </el-tab-pane>
        <el-tab-pane label="转入" name="3">
          <value-list :lists="tvList" :type="1"/>
        </el-tab-pane>
        <el-tab-pane label="转出" name="4">
          <value-list :lists="tvList" :type="1"/>
        </el-tab-pane> -->
      </el-tabs>
      <div class='date-list'>
        <el-date-picker
          v-model="value7"
          type="daterange"
          align="right"
          :unlink-panels="true"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          size='small'
          @change="dateChange"
        >
        </el-date-picker>
        <el-button type='primary' size='small' @click='searchData'>查询</el-button>
      </div>
    </div>
    <div v-if="tvMoreVisible" class='load-more' @click='loadMore'>查看更多</div>
    <msg-box :visible="approveVisible" :cancel="approveCancle" :submit="onApprove" :text="approveText"
             :reapprove="reapprove"/>
  </section>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import {handleRequestParams, handleWebStorage} from '@/utils/utils'
  import C from '@/utils/personal'
  import axios from '@/plugins/axios'
  import state from '@/store/state'
  import {mapState, mapActions, mapMutations} from 'vuex'
  import ValueList from './ValueList'
  import MsgBox from '@/components/MsgBox/MsgBox'

  export default {
    data() {
      return {
        activeName: '0',
        tableData: [{}],
        pickerOptions: {
          // disabledDate(time) {
          //   return time.getTime() > Date.now();
          // },
        },
        value7: '',
        page: 1,
        startTime: "",
        endTime: "",
        approveVisible: false,
        approveText: '',
        reapprove: null,
        unlinkPanels: false
      }
    },
    components: {
      ValueList, MsgBox
    },
    computed: {
      ...mapState([
        'tvBalance', //获取 钛值数据 state
        'tvList', //获取 钛值流水 state
        'KGUser', //获取 用户数据
        'tvMoreVisible' //钛值加载更多按钮
      ])
    },
    mounted() {
      const that = this
      if (handleWebStorage.getLocalData('shit_open') == 2) {
        this.activeName = '3'
        this.getTableData(this.activeName, 1)
      } else if (handleWebStorage.getLocalData('roll_out_open') == 2) {
        this.activeName = '4'
        this.getTableData(this.activeName, 1)
      }
    },
    methods: {
      ...mapActions([]),
      ...mapMutations([
        'SET_MODULE_PICK', //设置 模块显示
        'SET_TVLIST', //设置 钛值流水 state
        'NEWTVLIST_LOADING_MORE', //加载跟多 mutation
        'SET_TVMORE_VISIBLE', //设置加载更多按钮 state
        'SET_TXADDRESS',//设置钛值转入地址
      ]),
      approveCancle() {
        this.approveVisible = false
      },
      onApprove() {
        if (this.reapprove) {
          location.href = "#account"
          handleWebStorage.setLocalData('approve_open', 2)
          location.reload()
        } else {
          this.approveVisible = false
        }
      },
      //切换流水类型
      handleClick(tab, event) {
        localStorage.setItem('activeName', tab.index);
        handleWebStorage.setLocalData('shit_open', 1)
        handleWebStorage.setLocalData('roll_out_open', 1)
        this.activeName = tab.index;
        this.page = 1;
        this.getTableData(tab.index, 1)
      },
      handleCurrentChange() {
      },
      searchData() {
        if (this.startTime == '' || this.endTime == '') {
          this.$message({
            type: "warning",
            message: '筛选日期不能为空'
          })
          return
        }
        this.page = 1;
        this.getTableData(this.activeName, 1)
      },
      dateChange(val) {
        if (val == null) {
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
      rollOutHandle() {
        const that = this;
        const list = {
          "userId": this.KGUser.userId,
        }
        this.ajax({
          url: '/userkg/getCertificate',
          data: list,
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            if (res.code == 10000) {
              res = res.responseBody;
              if (res.realnameAuthed == 1) {
                that.SET_MODULE_PICK('RollOut')
                C.redirect('#roll_out')
              } else {
                if (res.certificateStatus == 0) {
                  that.approveVisible = true;
                  that.approveText = '您的实名认证审核不通过，请重新认证'
                  that.reapprove = 1
                } else if (res.certificateStatus == 2) {
                  that.approveVisible = true;
                  that.approveText = '您的实名认证还在审核中'
                } else {
                  that.approveText = '需通过实名认证，才能转出钛值'
                  that.approveVisible = true;
                  that.reapprove = 1
                }
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
      shift() {
        const that = this
        this.SET_MODULE_PICK('Shift')
        C.redirect('#shift')
      },
      getTableData(index, page) {
        const list = this.postList(index, page);
        const that = this;
        this.ajax({
          url: '/accountFlow/selectByUserflow',
          data: list,
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            if (res.code == 10000) {
              if (res.responseBody.currentPage >= res.responseBody.totalPage) {
                that.SET_TVMORE_VISIBLE(false)
              } else {
                that.SET_TVMORE_VISIBLE(true)
              }
              that.SET_TVLIST(res.responseBody.data)
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
        this.page += 1;
        const list = this.postList(this.activeName, this.page);
        const that = this;
        this.ajax({
          url: '/accountFlow/selectByUserflow',
          data: list,
          headers: {
            token: that.KGUser.token
          },
          success: (res) => {
            if (res.code == 10000) {
              if (res.responseBody.currentPage >= res.responseBody.totalPage) {
                that.SET_TVMORE_VISIBLE(false)
              } else {
                that.SET_TVMORE_VISIBLE(true)
              }
              that.NEWTVLIST_LOADING_MORE(res.responseBody.data)
            } else {
              that.$message({
                message: res.message,
                type: 'error'
              });
            }
          }
        })
      },
      postList(index, page=1) {
        let list = null
        switch (index) {
          case '0':
            list = {
              "userId": this.KGUser.userId,
              "currentPage": page
            }
            break;
          case '1':
            list = {
              "userId": this.KGUser.userId,
              "Type": 1,
              "currentPage": page
            }
            break;
          case '2':
            list = {
              "userId": this.KGUser.userId,
              "Type": 2,
              "currentPage": page
            }
            break;
          case '3':
            list = {
              "userId": this.KGUser.userId,
              "businessTypeId": 10,
              "currentPage": page
            }
            break;
          case '4':
            list = {
              "userId": this.KGUser.userId,
              "businessTypeId": 20,
              "currentPage": page
            }
            break;
          case '5':
            list = {
              "userId": this.KGUser.userId,
              "Type": 3,
              "currentPage": page
            }
            break;
          default:
        }
        if (this.startTime != "" && this.endTime != "") {
          list.startTime = this.startTime
          list.endTime = this.endTime
        }
        return list
      }
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/index.styl'

  .tv
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
        .shift, .roll-out
          cursor pointer
        .shift:hover, .roll-out:hover
          color $color-text-active
        .line
          margin 0px 16px
      .balance, .freeze
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
        display flex
        flex-direction column
        justify-content center
        background rgba(255, 255, 255, 1);
        // box-shadow 4px 15px 8px rgba(229, 227, 227, 0.3);
        cursor pointer
        p
          margin 0 auto
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
.el-date-range-picker
  width 258px
  .is-right
    display none
</style>
