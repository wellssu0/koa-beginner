const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')  //mongodb
const {mongoURL} = require('./config/keys')  //mongodb地址
const bodyParser = require('koa-bodyparser')  //获取前端传过来的数据
const passport = require('koa-passport')  

//实例化koa
const app = new Koa()
const router = new Router()

app.use(bodyParser())

const users = require('./routes/api/users')

//路由
router.get('/',async ctx => {
  ctx.body = { msg: 'Hello Koa Interfaces' }
})

//连接数据库
mongoose
  .connect(mongoURL,{ useNewUrlParser:true,useUnifiedTopology: true })
  .then(()=>{
    console.log('Mongodb Connected...')
  }).catch(err=>{
    console.log(err)
  })

//初始化koa-passport
app.use(passport.initialize())
app.use(passport.session())
//将koa-passport传到/config/passport.js文件中
require('./config/passport')(passport)

//配置路由地址
router.use('/api/users', users)

//配置路由
app.use(router.routes()).use(router.allowedMethods())

//设置端口
const port = process.env.PORT || 5000

//监听端口
app.listen(port,()=>{
  console.log(`server started on ${port}`)
})

