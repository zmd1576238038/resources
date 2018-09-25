/**
 * 哈哈哈哈，一行来自宇宙的代码
 */
// 中间件转发请求 ====
const https = require('https')
const querystring = require('querystring')
let axios = require('axios')
const baseUrl = require('./config/nodeConfig')

module.exports = async function httpsRequest(req,res) {
    const {url,method,headers,body,query} = req
    // axios接口转发
    const options = {
      method:method.toLocaleLowerCase(),
      url:`${url.replace('/api1','')}`,
      data:method.toLocaleLowerCase() === 'post'? querystring.stringify(body):query,
      baseURL:baseUrl,
      headers:{
        'Content-type': headers['content-type'],
        token:headers['token'] || '',
      },
    }
    axios.interceptors.response.use(
      response => {
        return response
      },error => {
        return error.response || error
      }
    )
    return await axios(options)


  // node https请求
  // return await new Promise((resolve,reject)=>{
  //   if(method.toLocaleLowerCase() === 'get'){
  //     https.get('https://dev.kg.com/hotsearch/selectHotAll',result=>{
  //       let body = '';
  //       result.on('data',data=>{
  //         body+=data
  //       }).on('end',()=>{
  //         resolve(body)
  //       })
  //     })
  //   }else if(method.toLocaleLowerCase() === 'post') { //post请求
  //     const opt = {
  //       method:'POST',
  //       host:'dev.kg.com',
  //       path:`${url.replace('/api','')}`,
  //       headers:{
  //         'content-type': headers['content-type'],
  //         token:headers['token'] || '',
  //       },
  //     }
  //     var request = https.request(opt,res=>{
  //       let d = '';
  //       res.on('data',data=>{
  //         d+=data.toString("utf8")
  //       }).on('end',()=>{
  //         let resolvedata
  //         try {
  //           resolvedata = JSON.parse(d)
  //         }catch (e) {
  //           resolvedata = d
  //         }
  //         resolve(resolvedata)
  //       })
  //     })
  //     request.on('error',function (e) {
  //       resolve(e)
  //     })
  //     request.write(querystring.stringify(req.body))
  //     request.end()
  //   }
  // })
}

