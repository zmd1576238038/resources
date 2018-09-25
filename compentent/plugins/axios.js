/*
 * @Description: 重写axios二次封装
 * @Author: LiuZhen
 * @Date: 2018-06-03 11:12:08
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-21 14:55:24
 */
import axios from 'axios'
import { handleRequestParams, formCode } from '@/utils/utils'
import { WEBSTORAGE_TOKEN_NAME, apiByENV } from '@/config/config'
import { Message } from 'element-ui'

const Axios = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
})


// http request请求拦截器(所有请求发送都要执行的操作)
Axios.interceptors.request.use(
  config => {
    //服务端设置全称  不然报错
    // if (process.server) {
    //   config.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 8112}`
    // }
    // //所有接口前置api区分拦截
    // config.url = `/api1${config.url}`


    // 根据环境设置baseURL
    config.baseURL = apiByENV

    // 参数序列化
    if (config.method === 'post') {
      // if(config.data && config.data.codeType && config.data.codeType === 'formType'){
      //   let formdata = config.data
      //   let token = formdata.codeToken
      //   delete formdata.codeType
      //   delete formdata.codeToken
      //   config.data = formCode(formdata,token)
      //   config.headers['token'] = token
      // }else {
        let token = config.headers.token || '';
        config.data = handleRequestParams(config.data, token)
      // }

    }
    return config
  }, error => {
    return Promise.reject(error)
  }
)

// http response响应拦截器
Axios.interceptors.response.use(
  response => {
    if(response.data.code === '10004' || response.data.code === '100011'){
      Axios.post('/api/logout')
    }else if(response.data.code !== '10000'){
     Message({
       type:'warning',
       message:response.data.message || '系统内部错误',
       duration:2000,
       showClose:true
     })
    }
    return response
  }, error => {
    // 处理报错的时候，默认返回个错误code  不然报错页面打不开 不良好
    return {data:{code:'error'}}
  }
)

export default Axios
