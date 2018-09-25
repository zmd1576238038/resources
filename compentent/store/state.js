/*
 * @Description: 应用状态树 State
 * @Author: LiuZhen
 * @Date: 2018-05-29 14:55:44
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 10:21:05
 */
const state = {
  // 全局
  KGUser: null,               // 用户token
  Avatar:'',                // 用户头像
  // 首页
  bannerList: [],           // 所有广告位列表数据
  indexCarouselList: [],    // 首页轮播数据
  indexBannerList: [],      // 首页通栏广告数据
  indexNewsFlashList: [],   // 首页快讯数据
  cooPartnerList: [],       // 合作伙伴列表数据

  // 用户登录状态
  userLoginStatus: false,

  // 搜索浮层显示状态
  searchEleStatus: false,

  //视频详情
  videoData:{}, //视频详情数据

  // 意见反馈弹出层状态
  feedbackStatus: false,

  //个人中心sidebar
  personalSidebar:[
    {name: '我的财富', module: 'MyTreasure', link: '#', icon: "wallet1"},
    {name: '我的专栏', module: 'MyColumn', link: '#column', icon: "zhuanlan"},
    {name: '我的评论', module: 'MyComment',  link: '#comment', icon: "review"},
    {name: '我的收藏', module: 'MyCollect', link: '#collect', icon: "sc"},
    {name: '账户与安全', module: 'Account', link: '#account', icon: "security"}
  ],
  modulePick: '',
  tvBalance: [], //钛值数据
  tvList: [], //钛值流水列表
  tvStartTime:'', //钛值流水筛选 开始时间
  tvEndTime:'', //钛值流水筛选 结束时间
  tvMoreVisible:false, //钛值查看更多按钮
  kgMoreVisible:false, //氪金查看更多按钮
  kgBalance: [],   // 氪金
  kgList: [],   // 氪金数据流水列表
  txAddress:'',//钛值转入地址
  personalBaseInfo:[],//个人基本资料
  personalAccountInfo:{}, //个人账户资料
  sendMsgDisabled: false, //短信验证码按钮是否禁用
  sendMsgTime: 90, //短信验证码倒计时
  oldPhoneVisible: false, //修改老手机弹窗 visible
  newPhoneVisible: false, //绑定新手机弹窗 visible
  traderPwdVisible: false, //交易密码弹窗 visible
  serviceTel: '028-86056123', //客服电话
  slideInfo:{
    'session':'',
    'sig':'',
    'token':'',
    'scene':''
  }, //滑块验证信息
}

export default state
