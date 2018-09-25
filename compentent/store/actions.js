/*
 * @Description: 应用状态树 Actions
 * @Author: LiuZhen
 * @Date: 2018-05-29 15:33:31
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-11 18:52:02
 */
import axios from '@/plugins/axios'
import $http from 'axios'
import { handleRequestParams, getCookie } from '@/utils/utils'

const actions = {
  // 全局数据获取
  async nuxtServerInit ({ commit, state },  { req, res, route }) {
    // 获取req的cookie
    const cookie = getCookie(req)
    if (cookie && cookie.token && cookie.userId) {
      commit('SET_USER_TOKEN', {token:cookie.token,userId:cookie.userId})
      commit('SET_USER_LOGIN_STATUS', true)
    } else {
      commit('SET_USER_TOKEN', null)
      commit('SET_USER_LOGIN_STATUS', false)
    }
  },

  // 用户登录请求，在这里将用户信息传递到本地 Express服务器的session中
  async userLogin ({ commit, state }, { token, userId }) {
    try {
      let { data } = await $http.post('/api/login', { token, userId })
      commit('SET_USER_TOKEN', data)
      commit('SET_USER_LOGIN_STATUS', true)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('bad error')
      }
      throw error
    }
  },

  // 用户退出登录，删除信息
  async userLogout ({ commit }) {
    try {
      Promise.resolve($http.post('/api/logout')).then(({ data }) => {
        if (data.ok) {
          commit('SET_USER_TOKEN', null)
          commit('SET_USER_LOGIN_STATUS', false)
        }
      })
    } catch (error) {
      throw error
    }
  },

  // 加载更多
  loadingMore ({ commit, state }, type) {
    if (!type) {
      throw new Error('params "type" is must description')
    }

    let reqUrl = null,
        params = null

    // 根据传递的type类型参数指定获取数据的url地址
    switch (type) {
      case 'article':
        params = handleRequestParams({"currentPage":state.indexNewsPagenum}, state.token)
        reqUrl = `/article/selectArticleAll/?${params}`
        break

      case 'video':
        params = handleRequestParams({"currentPage":state.indexVideoPagenum}, state.token)
        reqUrl = `/article/getChannelArt/?${params}`
        break
    }

    try {
      Promise.resolve(axios.post(reqUrl))
      .then(({ data }) => {
        if (type === 'article') {
          commit('NEWSLIST_LOADING_MORE', data.responseBody.data)
          commit('SET_INDEX_NEWS_PAGENUM', state.indexNewsPagenum + 1)
        }

        if (type === 'video') {
          commit('VIDEOLIST_LOADING_MORE', data.responseBody.data)
          commit('SET_INDEX_VIDEO_PAGENUM', state.indexVideoPagenum + 1)
        }
      })
    } catch (e) {
      throw new Error(e)
    }
  },

  // 获取钛值流水表
  getTVList({commit,state},type){
    try {
      Promise.resolve(axios.post('/accountFlow/selectByUserflow?' + handleRequestParams({"currentPage":1}, state.token)))
      .then(({ data }) => {
        commit('SET_TXBVALUE_LIST', data.responseBody.data)
      })
    } catch (e) {
      throw new Error(e)
    }

    // let [tvBalance, tvList] = await Promise.all([
    //   axios.post('/account/selectByUserbalance', {userId: store.state.KGUser.userId}),
    //   axios.post('/accountFlow/selectByUserflow', {userId:store.state.KGUser.userId,currentPage:1})
    // ])
    // store.commit('SET_TVBALANCE', tvBalance.data.responseBody.data)
    // store.commit('SET_TVLIST', tvList.data.responseBody.data)
  }

}

export default actions
