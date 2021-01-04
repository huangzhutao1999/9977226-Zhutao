var express = require('express');
var router = express.Router();
 
var UserEntity = require('../models/user').UserEntity;
 
var RestResult = require('../RestResult');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*cool*/
router.get('/cool', function(req, res, next) {
    res.render('users/cool', {
    title: "Cool",
    body: "Your are so cool"
  });

});

/*test*/
router.post('/test', function(req,res,next){
//    res.render('/users/test', {
//        title:"test",
//        req: req
//    });
    console.log(req.body);
    res.send(req.body);
    return;

});
 
//注册路由
router.post('/register',function(req,res,next){
    var restResult = new RestResult();
    var mobile = req.body.mobile;
    console.log(req); 
    console.log(mobile);
    if (!/1\d{10}/.test(mobile)){//手机号码格式校验
        restResult.errorCode = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.errorReason = "请填写正确的手机格式";
        res.send(restResult);
        return;
    }
    var password = req.body.password;
    if(!password || password.length < 6){//密码长度校验
        restResult.errorCode = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.errorReason = "密码长度不能少于6位";
        res.send(restResult);
        return;
    }
 
    //findOne方法,第一个参数数条件,第二个参数是字段投影,第三那个参数是回调函数
    UserEntity.findOne({mobile:mobile},'_id',function(err,user){
        if(err){//查询异常
            restResult.errorCode = RestResult.SERVER_EXCEPTION_ERROR_CODE;
            restResult.errorReason = "服务器异常";
            res.send(restResult);
            return;
        }
 
        if (user){//手机号已注册
            restResult.errorCode = RestResult.BUSINESS_ERROR_CODE;
            restResult.errorReason = "手机号已注册";
            res.send(restResult);
            return;
        }
 
        var registerUser = new UserEntity({mobile:mobile,password:password});
        //调用实体的实例的保存方法
        registerUser.save(function(err,row){
            if(err){//服务器保存异常
                restResult.errorCode = RestResult.SERVER_EXCEPTION_ERROR_CODE;
                restResult.errorReason = "服务器异常";
                res.send(restResult);
                return;
            }
 
            res.send(restResult);//返回成功结果
 
        });
 
    });
 
});
 
 
 
//登陆路由
router.post('/login',function(req,res,next){
    var restResult = new RestResult();
    var mobile = req.body.mobile;
    if (!/1\d{10}/.test(mobile)){//手机号码格式校验
        restResult.errorCode = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.errorReason = "请填写正确的手机格式";
        res.send(restResult);
        return;
    }
    var password = req.body.password;
    if(!password){
        restResult.errorCode = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.errorReason = "密码不能为空";
        res.send(restResult);
        return;
    }
 
    UserEntity.findOne({mobile:mobile,password:password},{password:0},function(err,user){
        if(err){
            restResult.errorCode = RestResult.SERVER_EXCEPTION_ERROR_CODE;
            restResult.errorReason = "服务器异常";
            res.send(restResult);
            return;
        }
 
        if(!user){
            restResult.errorCode = RestResult.BUSINESS_ERROR_CODE;
            restResult.errorReason = "用户名或密码错误";
            res.send(restResult);
            return;
        }
 
        restResult.returnValue = user;
        res.send(restResult);
 
        //更新最后登陆时间
        UserEntity.update({_id:user._id},{$set: {lastLoginTime: new Date()}}).exec();
 
    });
 
});


// 授权验证




module.exports = router;
