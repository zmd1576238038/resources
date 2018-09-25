/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 14:01:10
 */
<template>
    <div>
      <ul v-if="lists[0]" class = 'value-list'>
        <!-- @click="showDetail(item)" -->
        <li v-for = "(item,index) in lists" :key = "index" >
          <div>
            <p class = 'tit'>{{item.flowDetail}}</p>
            <p class = 'time'>{{item.flowDate}}</p>
          </div>
          <p class="type-name">{{item.typename}}</p>
          <div class = 'balance'>
              <p> {{ item.freezeAmount == 0 || item.freezeAmount == null ? (item.amount>0?'+'+item.amount:item.amount) : item.freezeAmount }}{{type == 1 ? "TV" : "KG"}}</p>
              <p class="freezeColor"> {{ item.freezeAmount > 0 ? "冻结中":"" }}</p>
          </div>
        </li>
      </ul>
      <div v-else class="no-data">
        <img :src="defaultImg"/>
        <p>暂无数据</p>
      </div>
      <account-detail :visible="detaiVisible" :cancelClose="cancelClose"/>
    </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import { handleRequestParams } from '@/utils/utils'
import axios from '@/plugins/axios'
import state from '@/store/state'
import { mapState } from 'vuex'
import AccountDetail from './AccountDetailModal'

export default {
  data () {
    return {
      defaultImg:require('../../assets/img/personal/nodata.png'),
      detaiVisible:false,
    }
  },
  props:{
    lists:{},
    type:{}
  },
  computed: {
    ...mapState([
      'KGUser'
    ])
  },
  mounted(){
  },
  methods: {
    showDetail(item){
      const that = this;
      this.detaiVisible = true
      // console.log('item',item)
      // axios({url:'/accountFlow/detailBill',method:'post',headers:{token:that.KGUser.token},data:{accountFlowId:item.accountFlowId,type:that.type}}).then(
      //   (res) => {

      //     console.log(res.data.responseBody.data)
      //   }
      // )
    },
    cancelClose(){
      this.detaiVisible = false
    }
  },
  components: {
    AccountDetail
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.value-list
  width 100%
  li
    width 100%
    height 100px
    display flex
    flex-direction row
    justify-content space-between
    background #f5f5f5
    font-size 14px
    padding 0px 20px
    margin-bottom 10px
    .type-name
      line-height 100px
    .tit
      width 480px
      no-wrap(2)
      color #666
      margin-top 30px
      margin-bottom 14px
      word-break break-all
    .time
      color #9b9b9b
    .balance
      min-width 200px
      no-wrap(1)
      text-align right
      padding-top 40px
      color #333
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
</style>
