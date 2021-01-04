var base = require('./Base');
const Schema = base.Schema;
const ObjectId = Schema.Types.ObjectId;

const bcrypt = require('bcryptjs');//引入bcryptjs
var salt = bcrypt.genSaltSync(10);//设置加密等级，如果不设置默认为10，最高为10

var UserSchema =new Schema({
    mail:{type: String}, // email 
    password:{
        type: String, 
        set(val){
        // 通过bcryptjs对密码加密返回值 第一个值返回值， 第二个密码强度
        return require('bcryptjs').hashSync(val,salt)
    }},//password
    address:{type: String},// address
    avatar: {type: String, default: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'},  // avatar
    authority:{type: String, default:"user"},  //user  authority
    lastLoginTime:Date,  // lastLogin
    createTime:{type:Date,default:Date.now}//create Time 
});
UserSchema.index({mail:1},{"background" : true});//设置索引
// 导出User模型
module.exports =  base.mongoose.model('UserEntity',UserSchema,'user');//指定在数据库中的collection名称为user
