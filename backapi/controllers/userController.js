const UserEntity = require('../models/user');
const async = require('async');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var RestResult = require('../RestResult');

const bcrypt = require('bcryptjs');//引入bcryptjs
const jwt = require('jwt-simple');
// const assert = require('http-assert');
const SECRET = require('../config/dev').secret;
const { request } = require('../app');

// 注册api 路由
exports.register = [
    // Validate fields.
    body('mail').isEmail().withMessage("Must be an email"),
    body('password').isLength({ min: 6 }).trim().withMessage('The password cannot be less than 6 digits'),
    body('address').isLength({ min: 1 }).trim().withMessage('Address must be specified.'),

    // Sanitize fields.
    sanitizeBody('mail').trim().escape(),
    sanitizeBody('password').trim().escape(),
    sanitizeBody('address').trim().escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {
        const restResult = new RestResult();
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const mail = req.body.mail;
        const password = req.body.password; // 加密密码
        const address = req.body.address;
            
        // 查询已存在用户，findOne方法,第一个参数数条件,第二个参数是字段投影,第三那个参数是回调函数
        UserEntity.findOne({ mail: mail }, '_id', function (err, user) {
            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values/errors messages.
                res.send({ status:"error", currentAuthority: 'guest' });
                return;
            } else {

                // 检验用户是否已存在
                if (user) {
                    restResult.errorCode = RestResult.BUSINESS_ERROR_CODE;
                    restResult.errorReason = "邮箱已注册!";
                    res.send({status:"error", currentAuthority: 'guest'});
                    return;
                }

                // Create an User object with escaped and trimmed data.
                var userCreated = new UserEntity({
                    mail: mail,
                    password: password,
                    address: address,
                });

                userCreated.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    console.log(restResult.errorCode);
                    // Successful - redirect to new author record.
                    res.send({status: "ok", currentAuthority: 'user'});
                });
            }
        });

    }
];


// 登陆路由
exports.login = [
    // Validate fields.
    body('userName').isEmail().withMessage("Must be an userName"),
    body('password').isLength({ min: 6 }).trim().withMessage('The password cannot be less than 6 digits'),

    // Sanitize fields.
    sanitizeBody('mail').trim().escape(),
    sanitizeBody('password').trim().escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {
        const restResult = new RestResult();
        // Extract the validation errors from a request.
        console.log(req.body);
        const errors = validationResult(req);
        const userName = req.body.userName;
        const password = req.body.password;
        const type = req.body.type;
        restResult.returnValue = {
            status: "error",
            dbUser:"guest",
            type,
            currentAuthority: "guest",
            token: ""
        };


        // 查询已存在用户，findOne方法,第一个参数数条件,第二个参数是字段投影,第三那个参数是回调函数
        UserEntity.findOne({mail:userName},function(err,dbUser){
            if(err){
                restResult.errorCode = RestResult.SERVER_EXCEPTION_ERROR_CODE;
                restResult.errorReason = "服务器异常";
                res.send(restResult.returnValue);
                return;
            }
     
            if(!dbUser){
                restResult.errorCode = RestResult.BUSINESS_ERROR_CODE;
                restResult.errorReason = "用户名或密码错误";
                res.send(restResult.returnValue);
                return;
            }

            const isPasswordValid = bcrypt.compareSync(password, dbUser.password);

            if(!isPasswordValid){
                restResult.errorCode = RestResult.BUSINESS_ERROR_CODE;
                restResult.errorReason = "用户名或密码错误";
                res.send(restResult.returnValue);
                return;
            }
            dbUser.userid = dbUser._id;
            dbUser.userName= dbUser.mail;
            const token = jwt.encode(dbUser, SECRET);
     
            restResult.returnValue = {
                status: "ok",
                dbUser:dbUser,
                type,
                currentAuthority: dbUser.authority,
                token: token
            };
            res.send(restResult.returnValue);
     
            //更新最后登陆时间
            UserEntity.update({_id:dbUser._id},{$set: {lastLoginTime: new Date()}}).exec();
     
        });

    }
]


// // 登出路由
// router.get("/logout",function(req,res,next){
//     req.session.YzmMessageIsAdmin = false;
//     req.session.YzmMessageUsername = "";
//     res.send("<script>alert('退出成功');location.href='/admin/login'</script>");

// });
// 获取当前用户
exports.getCurrentUser = [
    // Process request after validation and sanitization.
    async (req, res, next) => {
        const restResult = new RestResult();
        // Extract the validation errors from a request.
        console.log(req.body);
        const errors = validationResult(req);
        var Authorization = req.headers['Authorizatin'];
        if(Authorization) {
            var user = jwt.decode(Authorization.split(" ")[1], SECRET);

            if(user) {
                res.json(user);
            } else {
                return res.json({});
            }
        } else {
            return res.json({});
        }
    

    }
]