/*
 * @Description: 路由中间件，检查当前用户设备
 * @Author: LiuZhen
 * @Date: 2018-06-22 13:54:36
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 14:07:59
 */
export default ({ route, redirect, req }) => {
  let system = {
    windows: false,
    macOS: false,
    linux: false
  }

  let userAgent, isPC
  if (process.server) {
    userAgent = req.headers['user-agent'].toLowerCase()
  } else {
    userAgent = window.navigator.userAgent.toLowerCase()
  }

  system.windows = (/win/g).test(userAgent)
  system.macOS = (/macintosh/g).test(userAgent)
  system.linux = (/x11/g).test(userAgent) || ((/linux/g).test(userAgent) && !(/android/g).test(userAgent))

  isPC = system.windows || system.macOS || system.linux

  if (!isPC) {
    if (/\/article\/\d+/.test(route.fullPath)) {
      redirect('/h5Article/' + route.params.id)
    }

    if (/\/video\/\d+/.test(route.fullPath)) {
      redirect('/h5Video/' + route.params.id)
    }
  }
}
