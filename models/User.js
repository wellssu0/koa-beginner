const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * @User 用户模版
 * 
 * @gender 0保密,1男,2女
 * 
*/

const UserSchema = new Schema({
  name: {
    type:String,
    required:true
  },
  email: {
    type:String,
    required:true
  },
  password: {
    type:String,
    required:true
  },
  avatar: {
    type:String
  },
  gender: {
    type:Number,
    default:0
  },
  date: {
    type:Date,
    default:Date.now
  }
})

module.exports = User = mongoose.model('users', UserSchema)