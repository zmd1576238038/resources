/*
 * @Description: 普通个人详情页面
 * @Author: yym
 * @Date: 2018-06-12 17:34
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-20 19:10:37
 * @post: 动态获得userId再去获得用户详情和用户评论即可
 */
<template>
<div class="generalPersonInfo">
    <div class="generalPersonBanner"></div>
    <div class="generalPersonDetail">
        <p>{{generalPersonData.userName}}
            <span v-if="generalPersonData.realAuthedTag == 1">已实名</span>
        </p>
        <p> {{generalPersonData.resume?generalPersonData.resume:'作者太忙了，还没来得及写...'}}</p>
        <img :src="handleImgAddress(generalPersonData.avatar)" :alt="generalPersonData.columnName" :onerror="errorImg">
        <!-- <i v-if="generalPersonData.realAuthedTag" class="authedLogo"></i> -->
        <i class="authedLogo" v-if="generalPersonData.realAuthedTag == 1"></i>
    </div>
    <div class="generalPersonComments">
        <p class="title">TA的评论<span>({{myCommentList.totalNumber}})</span><i class="line"></i></p>
        <!-- 主内容区域 -->
        <div class="mycomment" v-for="(item, index) in myCommentList.data" :key="index">
            <p><span>评论了</span>
            <!-- <i @click="toArticle(item.articleId)">《{{item.articleTitle}}》</i> -->
                <nuxt-link :to="item.publishKind===2?concatUrl('video', item.articleId):concatUrl('article',item.articleId)" target="_blank">《{{(item.articleTitle)}}》</nuxt-link>
            </p>
            <p>"{{item.commentDesc}}"</p>
            <p>
              {{ item.commentDate }}
            </p>
        </div>
    </div>
    <div class="load-more">
      <el-button v-if="loadMoreVisible" @click="loadMore" :loading="loading">查看更多</el-button>
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
  head(){
    return {
      title: `${this.generalPersonData.userName}-千氪`,
    }
  },
  name: "generalPersonInfo",
  mixins: [handleImgMixin, concatUrlMixin],
  data() {
    return {
      generalPersonData: {},
      myCommentList: {},
      loading:false,
      page:1,
      userId:null,
      loadMoreVisible:false,
      errorImg: 'this.src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png"'
    };
  },

  async asyncData({ store, redirect, error, route }) {
    let userId = route.params.id;
    let [generalPersonData, myCommentList] = await Promise.all([
      axios.post("/userprofile/getByIdProfile", {
        userId: userId
      }), // 个人信息
      axios.post("/userComment/getothersComment", {
        userId: userId,
        currentPage: 1
      }) // 我的评论列表
    ]);
    const loadMoreVisible  = myCommentList.data.responseBody.currentPage >= myCommentList.data.responseBody.totalPage ? false : true
    return {
      generalPersonData: generalPersonData.data.responseBody.data,
      myCommentList: myCommentList.data.responseBody,
      userId:userId,
      loadMoreVisible:loadMoreVisible
    };
  },
  created() {
    if (
      this.generalPersonData.columnAvatar == null ||
      this.generalPersonData.columnAvatar.length === 0
    ) {
      this.generalPersonData.columnAvatar =
        "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png";
    } else {
      const imgUrl = this.generalPersonData.columnAvatar;
      if(imgUrl.match(/\^http/)){
        this.generalPersonData.columnAvatar = imgUrl
      }else {
        this.generalPersonData.columnAvatar =
          OSS_ADDRESS + this.generalPersonData.columnAvatar;
      }

    }
  },
  methods: {
    loadMore(){
        const that = this;
        this.loading = true;
        this.page += 1;
        const list = {
            userId: this.userId,
            currentPage:this.page
        }
        this.ajax({
            url: '/userComment/getothersComment',
            data: list,
            headers: {
              token:''
            },
            success:  (res) => {
                    if(res.code == 10000){
                          that.loadMoreVisible = res.responseBody.currentPage >= res.responseBody.totalPage ? false : true
                          res = res.responseBody.data;
                          for(var i in res){
                            that.myCommentList.data.push(res[i])
                          }
                          that.loading = false;
                    }else{
                        that.$message({
                            message: res.message,
                              type: 'error'
                        });
                    }
            }
          })
    },
    updateTimestampFilter(timeStamp) {
      return formatMsgTime(Number(timeStamp));
    },
    toArticle(id) {
      //   去文章详情
    },
    // strOverflow(str) {
    //   return handleStrOverflow(str);
    // }
  },
  components: {}
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.load-more{
  width:100%;
  margin-top:30px;
  button{
    width:100%;

  }
}
.generalPersonInfo {
    font-family: MicrosoftYaHei;
    width: 1260px;
    margin: 0 auto;
    margin-top: 20px;
    padding-bottom:60px;
    .generalPersonBanner {
        height: 240px;
        background-image :url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/normalbanner.png')
        background-size :contain;
        background-repeat :no-repeat;
    }

    .generalPersonDetail {
        position: relative;
        padding: 19px 60px 41px 228px;
        background-color: #fff;

        p:nth-child(1) {
            font-size: 16px;
            color: #333;

            span {
                padding: 5px 6px 5px 7px;
                color: #2382EA;
                font-size: 12px;
                background: rgba(236, 245, 255, 1);
                border-radius: 11px;
            }
        }

        p:nth-child(2) {
            width: 508px;
            font-size: 12px;
            line-height: 20px;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-top: 16px;
            min-height: 33px;
        }

        img {
            position: absolute;
            left: 60px;
            top: -34px;
            border: 9px solid #EBEBEB;
            border-radius: 50%;
            width: 130px;
            height: 130px;
            z-index: 1;
        }

        .authedLogo {
            display: block;
            width: 20px;
            height: 20px;
            background-image: url('../../assets/img/authorInfo/realName.png');
            background-size: 100% 100%;
            position: absolute;
            left: 160px;
            bottom: 43px;
            z-index: 2;
        }
    }

    .generalPersonComments {
        margin-top: 30px;
        background-color: #fff;
        .title {
            font-size: 16px;
            color: #2382EA;
            padding: 25px;
            padding-bottom: 21px;
            border-bottom: 1px solid #E6E6E6;
            position: relative;
            margin-bottom: 2px;

            span {
                font-size: 14px;
                color: #333;
                line-height: 16px;
            }

            .line {
                position: absolute;
                display: inline-block;
                width: 80px;
                height: 2px;
                background-color: #2382EA;
                left: 18px;
                bottom: -1px;
            }
        }

        .mycomment {
            margin-left: 29px;
            padding: 30px 30px 30px 0;
            border-bottom: 1px solid rgba(230, 230, 230, 1);
            position: relative;

            p:nth-child(1) {
                margin-bottom: 16px;
                a {
                    font-size: 14px;
                    color: #4F9FF6;
                    cursor: pointer;
                    font-style: normal;
                }

                span {
                    color: #666;
                    font-size: 14px;
                }
            }

            p:nth-child(2) {
                font-size: 16px;
                color: #333333;
                margin-bottom: 18px;
                no-wrap(2)
                display block
            }

            p:nth-child(3) {
                position: absolute;
                right: 30px;
                top: 33px;
                color: #666;
                font-size: 12px;
            }
        }
    }
}
</style>

