/*
 * @Description: 工具集
 * @Author: LiuZhen
 * @Date: 2018-05-29 20:54:14
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-22 14:52:17
 */
import Vue from 'vue'
import md5 from 'js-md5'
import {OSS_ADDRESS, WEBSTORAGE_TOKEN_NAME} from '@/config/config'
import state from '@/store/state'
import axios from '@/plugins/axios'

const Base64 = require('js-base64').Base64
const querystring = require('querystring')
/**
 *  @desc 格式化对象为字符串请求参数
 *  @param {*} data
 *  @return {*}
 *  @author liuzhen
 */
export const handleRequestParams = (data, token = "", type = "sign") => {
  let list = null;

  if (type === 'sign') {  // 需要data和token
    if (!data) {
      list = {
        "data": "",
        "sign": md5("" + token)
      }
    } else {
      list = {
        "data": Base64.encode(JSON.stringify(data)),
        "sign": md5(Base64.encode(JSON.stringify(data)) + token)
      }
    }

    return querystring.stringify(list)
  } else if (type === 'noSign') {
    // 账号密码登录
    list = {
      "data": Base64.encode(JSON.stringify(data))
    }

    return list
  }
}
export const formCode = (data,token) => {
  var list = new FormData()
  if(data === ''){
    list.append('data', '')
    list.append('sign', md5('' + token))
  }else {
    list.append('data', Base64.encode(JSON.stringify(data)))
    list.append('sign', md5(Base64.encode(JSON.stringify(data)) + token))
  }
  return list
}

/**
 * @desc 对多行文本做特殊处理，没有定高的区块内文字，超出参数规定字符，则截取多余部分并使用...替代
 * @param {*} str
 * @param {*} strNum
 * @return {*}
 * @author liuzhen
 */
export const handleStrOverflow = (str, strNum = 35) => {
  if (str) {
    if (str.length > strNum) {
      str = str.slice(0, strNum) + '...'
    }
  }

  return str
}

/**
 * @desc 图片地址拼接方法，若url中含有http或https，则直接返回该地址，若为空则返回默认图片地址
 * @param {*} imgAddr
 * @return {*}
 * @author liuzhen
 */
export const handleImgAddr = (imgAddr, isAvatar) => {
  if (!imgAddr && !isAvatar) {
    return OSS_ADDRESS + "180327/aticle" + Math.round(Math.random() * 32) + ".png"
  }
  if (!imgAddr && isAvatar) {
    return 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/1805/photocopy23x.png'
  }
  if (imgAddr.indexOf('http') > -1 || imgAddr.indexOf('https') > -1) {
    return imgAddr
  }

  return OSS_ADDRESS + imgAddr
}
export const randomImg = ()=>{
  return require(`@/assets/img/random/default${Math.round(Math.random()*19)+1}.png`)
}

/**
 * @desc 对本地存储 WebStorage 进行封装操作，包含设置、读取，删除和清空
 * @param none
 * @return Object
 * @author liuzhen
 */
export const handleWebStorage = {
  // 设置数据
  setLocalData: (key, value, type = "localStorage") => {
    // 如果value为对象或数组，则进行序列化
    if (Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Array]') {
      value = JSON.stringify(value)
    }

    if (type === 'localStorage') {   // 如果操作为默认的localStorge
      localStorage.setItem(key, value)
    } else if (type === 'sessionStorage') {
      sessionStorage.setItem(key, value)
    } else {
      throw new Error('params "type" is Error, it must able of "localStorage" or "sessionStorage"')
    }
  },

  // 获取数据
  getLocalData: (key, type = "localStorage") => {
    if (type === 'localStorage') {   // 如果操作为默认的localStorage
      return localStorage.getItem(key) || ''
    } else if (type === 'sessionStorage') {
      return sessionStorage.getItem(key) || ''
    }
  },

  // 删除某条数据
  removeLocalData: (key, type = "localStorage") => {
    if (type === 'localStorage') {
      localStorage.removeItem(key)
    } else {
      sessionStorage.removeItem(key)
    }
  },

  // 清空数据
  clearLocalData: (type = "localStorage") => {
    if (type === 'localStorage') {
      localStorage.clear()
    } else {
      sessionStorage.clear()
    }
  },

  // 批量将对象参数中的信息存入本地
  batchSetLocalData: (obj, type = "localStorage") => {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      throw new Error('params "obj" must be a Object')
    }

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (type === 'localStorage') {
          localStorage.setItem(key, obj[key])
        } else {
          sessionStorage.setItem(key, obj[key])
        }
      }
    }
  }
}
// 实例化 阿里滑块
export const aliBlock = (dom, me, csessionid, sig, token, scene, fn) => {
  var nc = new noCaptcha();
  let date = new Date();
  date = date.toISOString()
  var nc_appkey = "FFFF00000000017B0D9D";
  var nc_scene = "nc_login";
  var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
  var nc_option = {
    renderTo: dom, //渲染到该DOM ID指定的Div位置
    appkey: nc_appkey,
    scene: nc_scene,
    token: nc_token,
    // trans:{"key1":"code0"},//测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
    callback: function (data) { // 校验成功回调
      document.getElementById(csessionid).value = data.csessionid;
      document.getElementById(sig).value = data.sig;
      document.getElementById(token).value = nc_token;
      document.getElementById(scene).value = nc_scene;
      const list = {
        "platform": '3',
        "session": data.csessionid,
        "sig": data.sig,
        "token": nc_token,
        "scene": nc_scene,
      }
      me.handleSlide(data.csessionid, data.sig, nc_token, nc_scene)
      if (fn) {
        fn(dom, me, csessionid, sig, token, scene)
      }
    }
  };
  nc.init(nc_option);
}
// 发送验证码
export const sendMessage = (defaultPhone, form, list, id, csessionid, sig, token, scene, me) => {
  me.time = 90;
  window.clearInterval(me.interval);
  if (defaultPhone) {
    if(!list.session || !list.sig || !list.token || !list.scene){
      me.$message({
        type:'warning',
        message:'滑动滑块验证'
      })
      return false
    }
    me.interval = window.setInterval(function () {
      if ((me.time--) <= 0) {
        me.sendMsgDisabled = false;
        window.clearInterval(me.interval);
        aliBlock(id, me, csessionid, sig, token, scene)
        me.handleSlide('', '', '', '')
      }else {
        me.sendMsgDisabled = true
      }
    }, 1000);
    Vue.prototype.ajax({
      url: '/userkg/sendSmsEmailcode',
      data: list,
      headers: {
        token: ''
      },
      success: (res) => {
        if (res.code == 10000) {
          me.sendMsgDisabled = true;
          me.$message({
            message: res.message,
            type: 'success'
          });
        } else if (res.code == 10020) {
          me.$message({
            message: res.message,
            type: 'warning'
          });
          aliBlock(id, me, csessionid, sig, token, scene)
          me.handleSlide('', '', '', '')
        } else {
          me.$message({
            message: res.message,
            type: 'error'
          });
          aliBlock(id, me, csessionid, sig, token, scene)
          me.handleSlide('', '', '', '')
        }
      }
    })
  } else {
    me.$refs[form].validateField('phone', (phone) => {
      me.codeVisible = false
      me.interval = window.setInterval(function () {
        if ((me.time--) <= 0) {
          me.sendMsgDisabled = false;
          window.clearInterval(me.interval);
          aliBlock(id, me, csessionid, sig, token, scene)
          me.handleSlide('', '', '', '')
          //等待请求完毕后 关闭弹窗滑块

        }
      }, 1000);
      if (phone == "") {
        Vue.prototype.ajax({
          url: '/userkg/sendSmsEmailcode',
          data: list,
          headers: {
            token: ''
          },
          success: (res) => {
            if (res.code == 10000) {
              me.sendMsgDisabled = true;
              if (me.codeVisible) {
                me.codeVisible = false
              }

              me.$message({
                message: res.message,
                type: 'success'
              });
            } else if (res.code == 10020) {
              me.$message({
                message: res.message,
                type: 'warning'
              });
              aliBlock(id, me, csessionid, sig, token, scene)
              // me.handleSlide('', '', '', '')
            } else {
              me.$message({
                message: res.message,
                type: 'error'
              });
              aliBlock(id, me, csessionid, sig, token, scene)
              // me.handleSlide('', '', '', '')
            }
          }
        })
      } else {
        return false
      }
    });
  }
}

//时间戳转换日期
export const formatMsgTime = (time,type) => {
  time = parseInt(time)
  var dateTime = new Date(time);
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法
  var milliseconds = 0;
  var timeSpanStr;
  milliseconds = now.getTime() - time;
  let s = milliseconds / 1000,      //读取相差秒数
    realmin = s / 60,      //读取相差真实分钟数
    m = Math.floor(s / 60), //读取相差向下取整分钟数
    h = Math.floor(m / 60),//读取相差向下取整小时数
    realh = realmin / 60, //读取相差真实小时数
    d = Math.floor(h / 24),//读取相差天数
    mon = Math.floor(d / 30),//读取相差月数
    y = Math.floor(mon / 12); //读取相差年数
  if (y <= 0 && mon <= 0 && h < 24) {
    if (d == 1) {
      timeSpanStr = '昨天'
    } else if (d == 0 && realmin <= 3) {
      timeSpanStr = '刚刚';
    } else if (d == 0 && realh <= 1) {
      timeSpanStr = m + '分钟前';
    } else if (d == 0 && realh <= 24 && realh > 1) {
      if(now.getDate()>day || now.getMonth()+1 > month){
        timeSpanStr = '昨天'
      }else {
        timeSpanStr = h + '小时前';
      }
    }
  } else if (y <= 0 && mon <= 0 && h > 24 && h < 48) {
    if (d == 1) {
      timeSpanStr = '昨天'
    } else if (d == 2) {
      timeSpanStr = '前天'
    }
  } else if (y <= 0 && mon <= 0 && h > 24 && h >= 48 && h < 72) {
    if (d == 2) {
      timeSpanStr = '前天'
    } else {
      console.log('1')
    }
  } else if (y <= 0 && mon <= 0 && h >= 72) {
    if (d >= 3) {
      hour = hour < 10 ? '0' + hour : hour
      minute = minute < 10 ? '0' + minute : minute
      timeSpanStr = year + (type?'-':'年') + month + (type?'-':'月') + day + (type?'':'日') +' '+ hour + ':' + minute;
    }
  } else {
    timeSpanStr = year + (type?'-':'年') + month + (type?'-':'月') + day + (type?'':'日') +' ' + hour + ':' + minute;
  }
  return timeSpanStr;
}

// 获取URL上参数
export const getUrlQuery = (name, Url) => {
  //URL GET 获取值
  var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i"),
    url = Url || location.href;
  console.log('url', url)
  if (reg.test(url)) return unescape(RegExp.$2.replace(/\+/g, " "));
  return "";

}

// async 获取req.cookie
export const getCookie = req => {
  let cookie = {}
  if(req && req.headers && req.headers.cookie){
    const baseCookie = req.headers.cookie.split(';')
    for(var i = 0,len=baseCookie.length;i<len;i++){
      let itemCookie = baseCookie[i].split('=');
      let result
      try {
        result = decodeURIComponent(itemCookie[1].trim())
      }catch (e) {
        result = itemCookie[1].trim()
      }
      cookie[itemCookie[0].trim()] = result
    }
  }
  return cookie
}
// 判断浏览器类型
export const judgeBrower = ()=>{
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
  var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
  var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
  var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

  if (isFF) {  return "FF";}
  if (isOpera) {  return "Opera";}
  if (isSafari) {  return "Safari";}
  if (isChrome) { return "Chrome";}
  if (isEdge) { return "Edge";}
  if(isIE){
    //判断ie版本
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if(fIEVersion < 10){
      return 'IeLessTen'
    }else {
      return 'IeMoreTen'
    }
  }
}
