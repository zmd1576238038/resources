/*
 * @Description: 路由中间件 鉴权
 * @Author: LiuZhen
 * @Date: 2018-06-11 14:29:10
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-14 13:41:59
 */
import axios from '../plugins/axios'

export default function ({ req, res, store, route, redirect, error }) {
  if (route.fullPath.indexOf('/personal') > -1 && !store.state.KGUser) {
    redirect('/login')
  } else if (route.fullPath.indexOf('/personal') > -1 && store.state.KGUser) {
    axios.defaults.headers['token'] = store.state.KGUser.token
  }

  if (!route.fullPath.indexOf('/personal') > -1 && !store.state.KGUser) {
    axios.defaults.headers['token'] = ''
  }

  // if (route.fullPath.indexOf('/article') > -1 && req.session.KGUser) {
  //   axios.defaults.headers['token'] = req.session.KGUser.token
  // }

  // if (route.fullPath.indexOf('/video') > -1 && req.session.KGUser) {
  //   axios.defaults.headers['token'] = req.session.KGUser.token
  // }
}
