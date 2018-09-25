/*
 * @Description: 图片延迟加载插件
 * @Author: LiuZhen
 * @Date: 2018-05-28 13:20:00
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-28 14:08:28
 */
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '',
  loading: require('../assets/img/loading-svg/loading.svg'),
  attempt: 3
})
