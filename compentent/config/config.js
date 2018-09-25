/*
 * @Description: 全局配置文件
 * @Author: LiuZhen
 * @Date: 2018-05-30 10:08:14
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-22 16:28:43
 */
export const OSS_ADDRESS = process.env.__ENV === 'production'
                           ? 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/'
                           : 'https://test-kg-oss.oss-cn-beijing.aliyuncs.com/'

// 配置WebSocket链接地址
export const WEBSOCKET_ADDRESS = process.env.__ENV === 'production'
                                 ? 'wss://snatch.kg.com/'
                                 : 'wss://testsnatch.kg.com/'

// token命名
export const WEBSTORAGE_TOKEN_NAME = 'kg_desk_token'

// 跳转作者端
export const AUTHOR_URL = process.env.__ENV === 'production'? 'https://mp.kg.com':'https://testmp.kg.com/'

//图片上传
const location_host = '';
export const UPLOAD_IMG_ADDRESS = () =>{
  switch (process.env.__ENV) {
    case 'production':
      return 'https://webapi.kg.com/image/upload'
      break
    case 'test':
      return 'https://testwebapi.kg.com/image/upload'
      break
    case 'development':
      return 'https://dev.kg.com/image/upload'
      break
    default:
      return new Error()
  }
  // if(process.env.__ENV === 'production'){
  // return 'https://dev.kg.com/image/upload'
  // }else {
  // return 'https://testwebapi.kg.com/image/upload'
  // }
  // else{
  //   return 'https://kg.com/image/upload'
  // }
};

// 获取自定义系统变量用于识别当前运行环境，并输出api地址
const distingNodeEnv = () => {
  switch (process.env.__ENV) {
    case 'production':
      return 'https://webapi.kg.com/'
      break
    case 'test':
      return 'https://testwebapi.kg.com/'
      break
    case 'development':
      return 'https://dev.kg.com/'
      break
    default:
      return new Error()
  }
}

export const apiByENV = distingNodeEnv()

