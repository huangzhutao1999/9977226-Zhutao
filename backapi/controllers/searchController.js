const Genre = require('../models/genre');
const async = require('async');
const book = require('../models/book');
const bookinstance = require('../models/bookinstance');
const genre = require('../models/genre');
const author = require('../models/author');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const utils = require('../utils/utils');


var common = {};
router.use(function(req, res, next) {
    common = {
        title:'搜一下',
        subtitle:'据说什么都能搜',
        req : req,
    }
    next();
});

// search 
exports.search = (req, res, next) => {
    var param = req.query;
    param = utils.extend({for:'users',typeusers:'username',typebooks:'title',content:''},param);
    param.content = param.content.trim();
    common.param = param;
    res.send({status: sucess, message:"your are in search!!!"});

};