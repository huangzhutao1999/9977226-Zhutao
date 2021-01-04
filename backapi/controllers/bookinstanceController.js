const Bookinstance = require('../models/bookinstance');
const Book = require('../models/book');

const { body,validationResult, sanitizeBody } = require('express-validator');


// 显示完整的bookinstance列表
exports.bookinstance_list = (req, res, next) => {
    Bookinstance.find()
        .populate('book')
        .exec((err, list_bookinstance) => {
            if (err) {
                return next(err);
            }
            // Successful, so render
            res.render('library/bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstance});
        })
};

// 为每位bookinstance显示详细信息的页面
exports.bookinstance_detail = (req, res, next) => {
    Bookinstance.findById(req.params.id)
        .populate('book')
        .exec((err, bookinstance) => {
            if (err) {
                return next(err);
            }
            if (bookinstance==null) {  // No results.
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render
            res.render('library/bookinstance_detail', {title: 'Book', bookinstance: bookinstance});
        })
};

// 由GET显示创建bookinstance的表单
exports.bookinstance_create_get = (req, res, next) => {
    Book.find({}, 'title')
        .exec((err, books) => {
            if (err) {
                return next(err);
            }
            // Successful, so render.
            res.render('library/bookinstance_form', {title: 'Create BookInstance', book_list: books});
        });
};


// 由POST处理bookinstance创建操作
exports.bookinstance_create_post = [
    // Validate fields
    body('book', 'Book must be specified').isLength({min: 1}).trim(),
    body('imprint', 'Imprint must be specified').isLength({min: 1}).trim(),
    body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),

    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape,
    sanitizeBody('due_back').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new Bookinstance(
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back
            }
        );

        if (!errors.isEmpty()) {
            //There are errors. Render form again with sanitized values and error messages.
            Book.find({}, 'title')
                .exec((err, books) => {
                    if (err) {
                        return next(err);
                    }

                    // Successful, so render.
                    res.render('library/bookinstance_form', 
                        {
                            title: 'Create BookInstance', 
                            book_list: books, 
                            selected_book: bookinstance.book._id,
                            errors: errors.array(),
                            bookinstance: bookinstance
                        });
                });
                return;
        } else{
            // Data from form is valid.
            bookinstance.save((err) => {
                if (err) {
                    return next(err);
                }

                // Successful - redirect to new record.
                res.redirect(bookinstance.url);
            })
        }
    }
];

// 由GET显示删除bookinstance的表单
exports.bookinstance_delete_get = function(req, res, next) {

    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
        if (err) { return next(err); }
        if (bookinstance==null) { // No results.
            res.redirect('/catalog/bookinstances');
        }
        // Successful, so render.
        res.render('bookinstance_delete', { title: 'Delete BookInstance', bookinstance:  bookinstance});
    })

};

// 由POST处理bookinstance删除操作
exports.bookinstance_delete_post = function(req, res, next) {
    
    // Assume valid BookInstance id in field.
    BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of BookInstance items.
        res.redirect('/catalog/bookinstances');
        });

};

// 由GET显示更新bookinstance的表单
exports.bookinstance_update_get = function(req, res, next) {

    // Get book, authors and genres for form.
    async.parallel({
        bookinstance: function(callback) {
            BookInstance.findById(req.params.id).populate('book').exec(callback)
        },
        books: function(callback) {
            Book.find(callback)
        },

        }, function(err, results) {
            if (err) { return next(err); }
            if (results.bookinstance==null) { // No results.
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('bookinstance_form', { title: 'Update  BookInstance', book_list : results.books, selected_book : results.bookinstance.book._id, bookinstance:results.bookinstance });
        });

};


// 由POST处理bookinstance更新操作
exports.bookinstance_update_post = [

    // Validate and sanitize fields.
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
    
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped/trimmed data and current id.
        var bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id
           });

        if (!errors.isEmpty()) {
            // There are errors so render the form again, passing sanitized values and errors.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Update BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err,thebookinstance) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                   res.redirect(thebookinstance.url);
                });
        }
    }
];

