/*
 * @Description: Vuex应用状态树，Nuxt支持两种模式，普通模式和模块模式，这里由于数据量不大且并不复杂，采用普通模式
 * @Author: LiuZhen
 * @Date: 2018-05-29 14:52:17
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 13:58:52
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as getters from './getters'
import actions from './actions'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = () => new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  // plugins: debug ? [createLogger()] : []   // 不需要调试Vuex时可屏蔽此项，避免在服务端出现大量无用信息
})

export default store
