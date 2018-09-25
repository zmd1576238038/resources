const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const router = require('express').Router()
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const FileStreamRotator = require('file-stream-rotator')
const getDomain = require('./domain')
// const safeRquest = require('./http')
const PORT = process.env.PORT || 8112
const app = require('express')()

//日志
// const logDirectory = path.join(__dirname,'log')
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// var accessLogStream = FileStreamRotator.getStream({
//   date_format: 'YYYY-MM-DD',
//   filename: path.join(logDirectory, 'access-%DATE%.log'),
//   frequency: 'daily',
//   verbose: false
// })
// app.use(morgan('combined',{stream:accessLogStream}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// 用户发起登录请求, 成功后添加用户信息到 req.session.KGUser
router.post('/api/login', (req, res) => {
  if (req.body.token) {
    // 后续设置cookie看
    let domain = getDomain(req.hostname)
    res.cookie('token',req.body.token,{maxAge: 60000 * 60 * 24,domain})
    res.cookie('userId',req.body.userId,{maxAge: 60000 * 60 * 24,domain})
    return res.json({ token: req.body.token, userId: req.body.userId })
  }else {
    res.status(401).json({message: '401 Bad credentials'})
  }
})

// 用户发起注销请求
router.post('/api/logout', (req, res) => {
  let domain = getDomain(req.hostname)
  res.cookie('token','',{expires:new Date(0),domain})
  res.cookie('userId','',{expires:new Date(0),domain})
  return res.json({ ok: true })
})


//中间件拦截接口转发
// app.use((req,res,next)=>{
//   const url = req.originalUrl;
//   if(url.startsWith('/api') && url !== '/api/login' && url !== '/api/logout'){
//     return safeRquest(req).then(data=>{
//       res.json(data.data)
//     }).catch(err=>{
//       res.json(err.data)
//     })
//   }
//   next();
// });


app.use(router)

// 初始化 nuxt.js
let config = require('./nuxt.config.js')
const nuxt = new Nuxt(config)
app.use(nuxt.render)


if(config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
  .catch((error) => {
      console.log(error)
      process.exit(1)
  })
}

// 监听指定端口
app.listen(PORT, '0.0.0.0')
console.log('服务器运行于 localhost:' + PORT)
