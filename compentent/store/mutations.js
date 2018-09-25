/*
 * @Description: 应用状态树 Mutations
 * @Author: LiuZhen
 * @Date: 2018-05-29 15:31:15
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 10:22:06
 */
const mutations = {
  // 设置所有广告位banner数据
  SET_BANNER_LIST: (state, data) => {
    state.bannerList = data
  },

  // 设置登录用户信息
  SET_USER_TOKEN: (state, data) => {
    state.KGUser = data
  },

  // 设置用户登录状态
  SET_USER_LOGIN_STATUS: (state, data) => {
    state.userLoginStatus = data
  },

  // 设置搜索浮层显示状态
  SET_SEARCH_STATUS: (state, data) =>  {
    state.searchEleStatus = data
  },

  // 设置意见反馈弹出层显示状态
  SET_FEEDBACK_STATUS: (state, data) => {
    state.feedbackStatus = data
  },

  // 设置首页轮播图数据
  SET_INDEX_CAROUSEL: (state, data) => {
    state.indexCarouselList = data
  },

  // 设置首页通栏广告数据 indexBannerList
  SET_INDEX_BANNER: (state, data) => {
    state.indexBannerList = data
  },

  // 设置首页快讯数据 indexNewsFlashList
  SET_INDEX_NEWS_FLASH: (state, data) => {
    state.indexNewsFlashList = data
  },

  // 设置合作伙伴数据 cooperativePartnerList
  SET_COOPERATIVEPARTNER_LIST: (state, data) => {
    state.cooperativePartnerList = data
  },

  // 设置页脚其他数据 otherLinkList
  SET_OTHERLINK_LIST: (state, data) => {
    state.otherLinkList = data
  },

  // 文章列表页加载更多
  NEWSLIST_LOADING_MORE: (state, data) => {
    for (let i = 0; i < data.length; i++) {
      state.indexNewsList.push(data[i])
    }
  },

  // 视频列表页加载更多
  VIDEOLIST_LOADING_MORE: (state, data) => {
    for (let i = 0; i < data.length; i++) {
      state.indexVideoList.push(data[i])
    }
  },

  //设置钛值数据   tvBalance
  SET_TVBALANCE:(state, data) => {
    state.tvBalance = data
  },
  //设置钛值流水列表   tvList
  SET_TVLIST:(state, data) => {
    state.tvList = data
  },
  //钛值流水列表加载更多
  NEWTVLIST_LOADING_MORE:(state,data) => {
    for (let i = 0; i < data.length; i++) {
      state.tvList.push(data[i])
    }
  },
  //设置钛值流水表 开始时间 tvStartTime
  SET_TVSTART_TIME(state, data){
    state.tvStartTime = data
  },
  //设置钛值流水表 结束时间 tvEndTime
  SET_TVEND_TIME(state, data){
      state.tvEndTime = data
  },
  //设置钛值查看更多按钮 tvMoreVisible
  SET_TVMORE_VISIBLE(state, data){
    state.tvMoreVisible = data
  },
  //设置氪金数据 kgBalance
  SET_KGBALANCE:(state, data) => {
    state.kgBalance = data
  },

  //设置氪金流水列表 kgList
  SET_KGLIST:(state, data) => {
    state.kgList = data
  },
  //氪金流水列表加载更多
  NEWKGLIST_LOADING_MORE:(state,data) => {
    for (let i = 0; i < data.length; i++) {
      state.kgList.push(data[i])
    }
  },
  //设置氪金查看更多按钮 kgMoreVisible
  SET_KGMORE_VISIBLE(state, data){
      state.kgMoreVisible = data
  },
  //设置模块显示  modulePick
  SET_MODULE_PICK:(state,data) => {
    state.modulePick = data
  },
  //设置钛值转入地址 txAddress
  SET_TXADDRESS:(state, data) => {
    state.txAddress = data
  },
  // 设置用户访问站点时，将用户本地存储的token保存至vuex中，方便服务端调用
  SET_TOKEN: (state, data) => {
    state.token = data
  },
  //设置验证码按钮禁用状态
  SET_SEND_Msg_DISABLED: (state, data) => {
    state.sendMsgDisabled = data
  },
  //设置验证码倒计时
  SET_SEND_TIME: (state, data) => {
    state.sendMsgTime = data
  },
  //验证码倒计时递减
  SET_SEND_TIME_DEC: (state, data) => {
    state.sendMsgTime--
  },
  //设置老手机弹窗 oldPhoneVisible
  SET_OLDPHONE_VISIBLE: (state, data) => {
    state.oldPhoneVisible = data
  },
  //设置新手机弹窗 newPhoneVisible
  SET_NEWPHONE_VISIBLE: (state, data) => {
    state.newPhoneVisible = data
  },
  //设置交易密码弹窗 traderPwdVisible
  SET_TRADERPWD_VISIBLE: (state, data) => {
    state.traderPwdVisible = data
  },
  //设置个人基本资料 personalBaseInfo
  SET_PERSONAL_BASEINFO: (state, data) => {
    state.personalBaseInfo = data
  },
  //设置个人账户资料 personalAccountInfo
  SET_PERSONAL_ACCOUNTINFO: (state, data) =>{
    state.personalAccountInfo = data
  },
  //设置滑块验证信息 slideInfo
  SET_SLIDE_INFO: (state, data) => {
    state.slideInfo.session = data.session
    state.slideInfo.sig = data.sig
    state.slideInfo.nc_token = data.nc_token
    state.slideInfo.nc_scene = data.nc_scene
  },
  // 页脚合作伙伴列表设置
  SET_COOPARTNER_LIST: (state, data) => {
    state.cooPartnerList = data
  },
  //设置视频详情数据 videoData
  SET_VIDEO_DATA: (state,data) => {
    state.videoData = data
  },
  // 用户头像
  SET_AVATAR : (state, data) => {
    state.Avatar = data
  }
}

export default mutations
