const Router = require('koa-router')
const router = new Router()

const jwt = require('jsonwebtoken')

//密码加密模块
const bcrypt = require('bcrypt');
const saltRounds = 10;


//引入User模版
const User = require('./../../models/User')

/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
*/
router.get('/test',async ctx => {
  ctx.status = 200
  ctx.body = { msg: 'users works...' }
})

/**
 * @route POST api/users/register
 * @desc 注册接口地址
 * @access 接口是公开的
*/
router.post('/register',async ctx => {
  // console.log(ctx.request.body)从前端获取的数据
  //表单验证
  //存数据库
  //-先查数据库有没有
  const findResult = await User.find({email:ctx.request.body.email})
  if(findResult.length > 0){
    //已存在
    ctx.status = 200
    ctx.body = { 
      errorcode: 10000,
      msg: '该邮箱已被注册'
    }
  }else{
    //未存在

    //异步密码加密方法
    const encryptionPassword = async ( password ) => {
      let hashVal = ''
      await bcrypt.hash(password, saltRounds)
        .then( hash => hashVal = hash)
        .catch(err => console.log(err))
      return hashVal
    }

    //同步密码加密
    // const hash = bcrypt.hashSync(ctx.request.body.password, saltRounds); 

     //创建user实例
    const newUser = new User({
      name:ctx.request.body.name,
      email:ctx.request.body.email,
      password: await encryptionPassword(ctx.request.body.password)
      // password: hash  //同步密码加密
    })

    //存入数据库
    await newUser.save().then(user => {
      ctx.body = user  //返回数据到前台
    }).catch(err=>{
      console.log(err)
    })
  }
})


/**
 * @route GET api/users/login
 * @desc 登陆接口，返回token
 * @access 接口是公开的
*/
router.get('/login',async ctx => {
  //拿到匹配邮箱的user数组
  const findResult = await User.find({email:ctx.request.body.email})
  if(findResult.length > 0){

    //异步检查密码匹配
    const checkPassword = async (password, passwordHash) => {
      return await bcrypt.compare(password, passwordHash)
    }
    const match = await checkPassword(ctx.request.body.password, findResult[0].password)
    if(match){
      //生成token
      ctx.status = 200
      ctx.body = {
        errorcode: 0,
        success:true
      }
    }else{
      ctx.status = 200
      ctx.body = {
        errorcode: 10002,
        msg:'用户名或密码错误'
      }
    }
  }else{
    ctx.status = 200
    ctx.body = {
      errorcode: 10001,
      msg:'用户不存在'
    }
  }
})




module.exports = router.routes()