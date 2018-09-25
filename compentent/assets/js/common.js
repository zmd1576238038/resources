/*
 * @Description: 公共js
 * @Author: cb
 * @Date: 2018-06-08
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-22 16:05:20
 */
import $http from 'axios'
import axios from '@/plugins/axios'
import store from '@/store'
import { handleRequestParams, handleImgAddr, formatMsgTime } from '@/utils/utils'
import C from '@/assets/js/config'
const ip = "http://dev.kg.com"


//跳转标签页
export const toTag = (item) => {
  window.open("/tag/" + item)
}
//跳转作者专栏
export const toAuthor = (item) => {
  window.open('')
}
//微博绑定
export const weiboBind =() => {
  localStorage.removeItem('kg_third_openId');
  localStorage.removeItem('kg_bind_data');
  localStorage.setItem('localUrl', window.location.href);
  localStorage.setItem('openType', '0');
  window.open(
    'https://api.weibo.com/oauth2/authorize?client_id=' + C.wbKey+ '&redirect_uri=' + location.protocol + '//' + location.host + '/association',
    "newwindow",
    "height=555,width=1024,top=100,left=100"
  )
  // window.open(location.protocol + '//' + location.host + '/association')
}
// 微信绑定
export const wxBind = () => {
  localStorage.removeItem('kg_third_openId');
  localStorage.removeItem('kg_bind_data');
  localStorage.setItem('localUrl', window.location.href);
  localStorage.setItem('openType', '1');
  window.open(
    'https://open.weixin.qq.com/connect/qrconnect?appid=' + C.wxKey + '&redirect_uri=' + location.protocol + '//' + location.host + '/association' + '&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect',
    "newwindow",
    "height=555,width=1024,top=100,left=100"
  )
}

if(typeof window != 'undefined'){
  window.reload = function(){
          window.location.href = location.protocol + '//' + location.host + '/association'
  }
  window.goback = function(){
    console.log(1)
          window.location.href = '/'
  }
  window.reload2 = function(){
    window.location.reload()
  }
}

