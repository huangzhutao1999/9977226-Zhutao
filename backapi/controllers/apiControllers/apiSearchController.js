const Genre = require('../../models/genre');
const async = require('async');
const book = require('../../models/book');
const bookinstance = require('../../models/bookinstance');
const genre = require('../../models/genre');
const author = require('../../models/author');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const utils = require('../../utils/utils');


// search 
// router.use(function(req, res, next) {
//     common = {
//         req : req,
//     }
//     next();
// });

exports.search = (req, res, next) => {
    var req_param = req.query;
    // var resp_data = {};
    // param = utils.extend("",req_param);
    // param = param.trim();
    console.log(req_param);
    const keyword = req_param['value'].trim().split(/\s+/);
    console.log(keyword);
    keyword.forEach(value =>{
        new RegExp(value);
    });
    console.log(keyword);
    for(let value in keyword){
        console.log(value, keyword[value]);
        keyword[value] = new RegExp(keyword[value], 'i');
    }
    console.log(keyword);
    async.parallel({
        genre: (callback) => {
            // console.log(keyword[0]);
            genre.find({ "name": { $regex: keyword[0] } })
            .populate('book')
                .exec(callback);
        },
        books: (callback) => {
            book.find({$or:[
                {"title": { $regex: keyword[0]}},
                {"isbn": { $regex: keyword[0]}},
                {"summary": { $regex: keyword[0]}}
            ]})
            .populate('genre')
            .populate('author')
                .exec(callback);
        },
        authors: (callback) => {
            author.find({$or:[
                {"family_name": { $regex: keyword[0]}},
                {"first_name": { $regex: keyword[0]}}
            ]})
            .populate('book')
            .exec(callback);
        },
        bookinstances: (callback) => {
            bookinstance.find({$or:[
                {"status": { $regex: keyword[0]}},
                {"imprint": { $regex: keyword[0]}}
            ]})
            .populate('book')
            .populate('genre')
            .populate('author')
            .exec(callback);
        },
    }, (err, results)=> {
        if (err) {
            return next(err);
        }
        if (results.genre == null) {    // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.send({ genre: results.genre, books: results.books, authors: results.authors, bookinstances:results.bookinstances});
    });

    // res.send({status: 200, message:req_param});

};