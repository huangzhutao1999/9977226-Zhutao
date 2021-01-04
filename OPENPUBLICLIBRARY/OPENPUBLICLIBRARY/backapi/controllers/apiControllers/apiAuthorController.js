const Author = require('../../models/author');
const async = require('async');
const Book = require('../../models/book');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// 显示完整的作者列表
exports.author_list = (req, res, next) => {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec((err, list_authors) => {
            if (err) {
                return next(err);
            }
            // Successful, so render
            res.send({status: 200, title: 'Author List', author_list: list_authors});
        });
};

// 为每位作者显示详细信息的页面
exports.author_detail = (req, res, next) => {
    async.parallel({
        author: (callback) => {
            Author.findById(req.params.id)
                .exec(callback);
        },
        authors_books: (callback) => {
            Book.find({'author': req.params.id}, 'title summary')
                .exec(callback)
        },
    }, (err, results) => {
        if (err) {
            return next(err);    // Error in API usage.
        }
        if (results.author == null) {    // Error in API usage.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.send({title: 'Author Detail', author: results.author, author_books: results.authors_books});
    })
};

// 由GET显示创建作者的表单
exports.author_create_get = (req, res, next) => {
    res.send({title: 'Create Author'});
};

// 由POST处理作者创建操作
exports.author_create_post = [
    // Validate fields.
    body('first_name').isLength({min: 1}).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({min: 1}).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.send({title: 'Create Autor', author: req.body, errors: errors.array()});
            return;
        }else{
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });

            author.save((err) => {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to new author record.
                res.send({message: "create success!", newurl:author.url});
            });
        }
    }
];


// 由GET显示删除作者的表单
exports.author_delete_get = (req, res, next) => {
    async.parallel({
        author: (callback) => {
            Author.findById(req.params.id).exec(callback);
        },
        author_books: (callback) => {
            Book.find({'author': req.params.id}).exec(callback);
        },
    }, (err, results) => {
        if (err) {
            return next(err);
        }
        if (results.author == null) {  // No results.
            res.send('author not found!');
        }
        // Successful, so render.
        res.send( 
            {
                title: 'Delete Author',
                author: results.author,
                author_books: results.author_books
            });
    });
};

// 由POST处理作者删除操作
exports.author_delete_post = (req, res, next) => {
    async.parallel({
        author: (callback) => {
            Author.findById(req.params.id).exec(callback);
        },
        author_books: (callback) => {
            Book.find({'author': req.params.id}).exec(callback);
        },
    }, (err, results) => {
        if (err) {
            return next(err);
        }
        if (results.author == null) {  // No results.
            res.send('author not found!');
        }
        // Successful, so render.
        res.send( 
            {
                title: 'Delete Author',
                author_books: results.author_books
            });
    });
};

// 由GET显示更新作者的表单
exports.author_update_get = function (req, res, next) {

    Author.findById(req.params.id, function (err, author) {
        if (err) { return next(err); }
        if (author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.send({ title: 'Update Author', author: author });

    });
};

// 由POST处理作者更新操作
exports.author_update_post = [

    // Validate and santize fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data (and the old id!)
        var author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.send({ title: 'Update Author', author: author, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, author, {}, function (err, theauthor) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.send("update success!");
            });
        }
    }
];
