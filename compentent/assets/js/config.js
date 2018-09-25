/**
*  @description： 业务配置
*  @author： zhangchenle
*  @data:  2018.5.31
*/

// 图片域名地址配置
let imgUrl = {
  development: 'https://kgcom.oss-cn-shenzhen.aliyuncs.com/',
  test: 'https://kgcom.oss-cn-shenzhen.aliyuncs.com/',
  production: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/'
}
// 接口地址配置
let apiUrl = {
  development: 'https://dev.kg.com',
  test: 'https://testwebapi.kg.com',
  production: 'https://webapi.kg.com',
}
// 用户默认头像
let defaultPhotoUrl = {
  development: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png',
  test: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png',
  production: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png'
}
// 图片上传地址
let uploadImg = {
  development: 'https://dev.kg.com/image/upload',
  test: 'https://testwebapi.kg.com/image/upload',
  production: 'https://webapi.kg.com/image/upload'
}
// 第三方微博登录appKey
let wbappKey = {
  development: '3883397390',
  test: '3883397390',
  production: '3883397390'
}
// 第三方微信登录appKey
let wxappKey = {
  development: 'wx1fa983464d64de9e',
  test: 'wx1fa983464d64de9e',
  production: 'wx1fa983464d64de9e'
}
// 第三方登录appSecret
let appSecret = {
  development: '193338dc7e48eac91a010efef935ce3f',
  test: '193338dc7e48eac91a010efef935ce3f',
  production: '193338dc7e48eac91a010efef935ce3f'
}
//404 页面地址
let notFound = {
  development: 'https://www.kg.com/404.html',
  test: 'https://www.kg.com/404.html',
  production: 'https://www.kg.com/404.html'
}
export default {
  imgHost: imgUrl[process.env.__ENV],
  apiHost: apiUrl[process.env.__ENV],
  defaultPhotoUrl: defaultPhotoUrl[process.env.__ENV],
  uploadImgUrlHost: uploadImg[process.env.__ENV],
  wbKey: wbappKey[process.env.__ENV],
  wxKey: wxappKey[process.env.__ENV],
  appSecret: appSecret[process.env.__ENV],
  notFound: notFound[process.env.__ENV],
}
