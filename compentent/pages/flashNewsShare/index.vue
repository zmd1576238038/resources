<template>
    <div class="flashNewsShare">
        <div class="flashNewsShareBanner"></div>
        <div class="flashNewsShareInfo">
            <div class="time">
                <span><i class="timer"></i>2018-01-12</span><span>12:22</span>
            </div>
            <div class="info">
                <h1>【商务部新闻发言人就中方发布针对美国进口钢铁和铝产品232措施的中止减让产品清单发表谈话】</h1>
                <p>
                    GAS涨幅达到16.45%根据火币Pro交易平台数据显示，GAS最新成交价格为人民币404元，24小时最高价格达到人民币68530元，24小时最低价格为人民币343元，涨16.5%，24小时成交量为238753GAS。24小时最高价格达到人民币685.30元。GAS涨幅达到16.45%根据火币Pro交易平台数据显示，GAS最新成交价格为人民币404元，24小时最高价格达到人民币68530元，24小时最低价格为人民币343元。
                </p>
            </div>
            <div class="app">

            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import axios from "@/plugins/axios";
import {
  handleRequestParams,
  handleImgAddr,
  formatMsgTime
} from "@/utils/utils";
import { OSS_ADDRESS } from "@/config/config";
import { handleImgMixin, concatUrlMixin } from "@/utils/mixins";
export default {
  head: {
    title: "千氪快讯-你想要的都在这里",
    meta: [
      {
        hid: "keywords",
        name: "keywords",
        content: "千氪快讯-你想要的都在这里"
      },
      {
        hid: "description",
        name: "description",
        content: "千氪快讯-你想要的都在这里"
      }
    ]
  },
  name: "flashNewsShare",
  mixins: [handleImgMixin, concatUrlMixin],
  data () {
      return {
          data: {}
      }
  },
  layout: 'login',

  created () {

  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
body
    min-width 100% !important
    background-color #fff
    .flashNewsShare
        .flashNewsShareBanner
            width 100%
            height 51.2vw
            background-size 100% 100%
            background-image url('../../assets/img/flashShareBanner.png')
        .flashNewsShareInfo
            padding  6.133vw 6.666vw
            .time
                display inline-flex
                justify-content space-between
                width 100%
                font-size 4.8vw
                font-family PingFangSC-Regular
                color rgba(51,51,51,1)
                padding-bottom  6.133vw
                border-bottom 1px solid #D2D2D2
                .timer
                    display inline-block
                    height 4.8vw
                    width 4.8vw
                    background-size 100% 100%
                    background-image url('../../assets/img/blueTimerFlashNews.png')
                span
                    position relative
                span:first-child
                    padding-left 7.066vw
                    i
                        position absolute
                        left 0
            .info
                h1
                    padding 4vw 0
                    font-size 4.8vw
                    color #333
                    line-height 7vw
                p
                    font-size 4.266vw
                    line-height 6.5vw
                    color #333
            .app
                width 100%
                height 22.133vw
                background-size 100% 100%
                background-image url('../../assets/img/flashNewsAppDown.png')
                margin-top 10.8vw
                margin-bottom 6.666vw
</style>
