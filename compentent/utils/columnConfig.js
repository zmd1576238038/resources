export default {
  mapping: {
    jinrong: 'jinrong',//金融
    hongguan: 'jinrong',//宏观紧急
    hqfx: 'jinrong',// 行情分析
    chanjing: 'jinrong',// 商业产经
    hangqing: 'jinrong',// 股票期货
    waihui: 'jinrong',// 外汇风向
    zcyl: 'jinrong', // 政策一览
    xmzs: 'jinrong', // 项目展示

    keji: 'keji', // 科技
    qukuailian: 'keji', // 区块链
    kejidongtai: 'keji', // 科技动态
    bjgd: 'keji', // 百家观点
    hydx: 'keji', // 行业动向
    jsdt: 'keji', // 技术动态

    keshipin: 'keshipin', // 视频
    jiaoyixuetang: 'keshipin', // 交易学堂
    qupingquwen: 'keshipin', // 趣评趣闻
    xinwenbobao: 'keshipin',  // 新闻播报
    hangqingfenxi: 'keshipin',  // 行情分析
    weikepu: 'keshipin',  // 微科普
    zatan: 'keshipin',  // 杂谈

    dujia: 'dujia',  // 独家
    qkzw: 'dujia',  // 千氪朝闻
    qkbd: 'dujia',  // 千氪报道
    qkzf: 'dujia',  // 千氪专访
    qksd: 'dujia',  // 千氪速递
    qkgd: 'dujia',  // 千氪观点

    huodong: 'huodong', //活动
    xianshanghuodong: 'huodong', //线上活动
    xianxiahuodong: 'huodong', //线下活动

    tupian: 'tupian', // 图片

    gonggao: 'gonggao', // 公告
    bbgx: 'gonggao', // 版本更新
    cpsxyr: 'gonggao', // 产品上线预热
    tongzhi: 'gonggao', // 通知
    jlgg: 'gonggao', // 奖励公告

  },
  bannerConfig: {
    jinrong:{
      url:require('@/assets/img/bannerimg/jinrong.png'),
      title:'金融',
      tips:'用千氪 照亮金融'
    },
    keji: {
      url: require('@/assets/img/bannerimg/keji.png'),
      title:'科技',
      tips:'千氪科技 各有所明'
    },
    keshipin:{
      url: require('@/assets/img/bannerimg/keshipin.png'),
      title:'视频',
      tips:'领先的金融科技视频媒体'
    },
    dujia:{
      url: require('@/assets/img/bannerimg/dujia.png'),
      title:'独家',
      tips:'千氪的作者 都在这里'
    },
    huodong:{
      url: require('@/assets/img/bannerimg/huodong.png'),
      title:'活动',
      tips:'网罗天下活动 收获千氪知识'
    },
    tupian:{
      url: require('@/assets/img/bannerimg/tupian.png'),
      title:'图片',
      tips:'一图看尽千氪事'
    },
    gonggao:{
      url: require('@/assets/img/bannerimg/gonggao.png'),
      title:'公告',
      tips:''
    },
  },
  config: {
    jinrong: [
      {
        type: 'jinrong',
        columnId: 383,
        columnName: "金融"
      },
      {
        type: 'hongguan',
        columnId: 340,
        columnName: "宏观经济"
      },
      {
        type: 'hqfx',
        columnId: 364,
        columnName: "行情分析"
      },
      {
        type: 'chanjing',
        columnId: 344,
        columnName: "商业产经"
      },
      {
        type: 'hangqing',
        columnId: 312,
        columnName: "股票期货"
      },
      {
        type: 'waihui',
        columnId: 346,
        columnName: "外汇风向"
      },
      {
        type: 'zcyl',
        columnId: 361,
        columnName: "政策一览"
      },
      // {
      //   type: 'xmzs',
      //   columnId: 369,
      //   columnName: "项目展示"
      // }
    ],
    keji: [
      {
        type: 'keji',
        columnId: 384,
        columnName: "科技"
      },
      {
        type: 'qukuailian',
        columnId: 389,
        columnName: "区块链"
      },
      {
        type: 'kejidongtai',
        columnId: 390,
        columnName: "科技动态"
      },
      {
        type: 'bjgd',
        columnId: 366,
        columnName: "百家观点"
      },
      {
        type: 'hydx',
        columnId: 362,
        columnName: "行业动向"
      },
      {
        type: 'jsdt',
        columnId: 367,
        columnName: "技术动态"
      }
    ],
    keshipin: [
      {
        type: 'keshipin',
        columnId: 360,
        columnName: "视频",
      },
      {
        type: 'jiaoyixuetang',
        columnId: 392,
        columnName: "交易学堂",
      },
      {
        type: 'qupingquwen',
        columnId: 393,
        columnName: "趣评趣闻",
      },
      {
        type: 'xinwenbobao',
        columnId: 395,
        columnName: "新闻播报",
      },
      {
        type: 'hangqingfenxi',
        columnId: 396,
        columnName: "行情分析",
      },
      {
        type: 'weikepu',
        columnId: 397,
        columnName: "微科普",
      },
      {
        type: 'zatan',
        columnId: 398,
        columnName: "杂谈",
      }
    ],
    dujia: [
      {
        type: 'dujia',
        columnId: 385,
        columnName: "独家",
      },
      {
        type: 'qkzw',
        columnId: 370,
        columnName: "千氪朝闻",
      },
      {
        type: 'qkbd',
        columnId: 372,
        columnName: "千氪报道",
      },
      {
        type: 'qkzf',
        columnId: 371,
        columnName: "千氪专访",
      },
      {
        type: 'qksd',
        columnId: 373,
        columnName: "千氪速递",
      },
      {
        type: 'qkgd',
        columnId: 374,
        columnName: "千氪观点",
      },
    ],
    huodong: [
      {
        type: 'huodong',
        columnId: 381,
        columnName: "活动"
      },
      {
        type: 'xianshanghuodong',
        columnId: 401,
        columnName: "线上活动"
      },
      {
        type: 'xianxiahuodong',
        columnId: 399,
        columnName: "线下活动"
      },
    ],
    tupian: [
      {
        type: 'tupian',
        columnId: 386,
        columnName: "图片"
      },
    ],
    gonggao: [
      {
        type: 'gonggao',
        columnId: 387,
        columnName: "公告"
      },
      {
        type: 'bbgx',
        columnId: 375,
        columnName: "版本更新"
      },
      {
        type: 'cpsxyr',
        columnId: 376,
        columnName: "产品上线预热"
      },
      {
        type: 'tongzhi',
        columnId: 377,
        columnName: "通知"
      },
      {
        type: 'jlgg',
        columnId: 378,
        columnName: "奖励公告"
      },

    ]
  }
}
