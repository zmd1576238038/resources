<template>
    <div class="hotKeywords">
        <div class="hotKeywordsBanner"></div>
        <div class="hotKeyWordsInfo">
            <div class="keyWordsWrap">
                    <span class="keyWord" v-for="(item, index) in keyWordsData.data" :key="index">
                        <nuxt-link :to="'/search?keywords='+item.keywordDesc" target="_blank">{{item.keywordDesc}}</nuxt-link>
                    </span>
                <!-- <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination> -->
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import axios from "@/plugins/axios";
import ListHotArticle from "@/components/ListHotArticle/ListHotArticle";
import {
  handleRequestParams,
  handleImgAddr,
  formatMsgTime
} from "@/utils/utils";
import { OSS_ADDRESS } from "@/config/config";
import { handleImgMixin, concatUrlMixin } from "@/utils/mixins";
export default {
  head: {
    title: "千氪财经热词-你想要的都在这里",
    meta: [
      {
        hid: "keywords",
        name: "keywords",
        content: "千氪财经热词-你想要的都在这里"
      },
      {
        hid: "description",
        name: "description",
        content: "千氪财经热词-你想要的都在这里"
      }
    ]
  },
  name: "hotKeywords",
  mixins: [handleImgMixin, concatUrlMixin],
  data () {
      return {
          data: {}
      }
  },
  async asyncData({ store, redirect, error }) {
    let [keyWordsData, ] = await Promise.all([
      axios.post('/keywords/getkeywordsAll', {
        secondChannel: 0,
      })
    ]);
    return {
      keyWordsData: keyWordsData.data.responseBody
    };
  },
    // set cooPartner to vuex
  async fetch({ store, params }) {
    let { data } = await axios.post("/friendlylink/getfriendlyAll", {
      secondChannel: 0
    });
    store.commit("SET_COOPARTNER_LIST", data.responseBody.data);
  },
  created () {
      // console.log('data', this.keyWordsData)
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
.hotKeywords
    .hotKeywordsBanner
        width 100%
        height 320px
        background-image url('../../assets/img/keywords/hotKeyWordsBanner.png')
        background-size 100% 100%
    .hotKeyWordsInfo
        width 100%
    .keyWordsWrap
        width 1136px
        min-height 600px
        padding-bottom 30px
        padding-left 50px
        padding-top 50px
        padding-right 74px
        background-color #fff
        margin 0 auto
        top -90px
        position relative
        z-index 2
        .keyWord
            display inline-block
            font-size 14px
            padding 13px 28px 12px 29px
            border-radius 20px
            margin-right 30px
            margin-bottom 50px
            border 1px solid #EBEBEB
            a
              color #666666
        .keyWord:hover
            border-color #2382ea
            a
              color #2382ea
</style>
