var Book = require('../../models/book');
var Author = require('../../models/author');
var Genre = require('../../models/genre');
var BookInstance = require('../../models/bookinstance');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { success } = require('../../RestResult');

// 站点首页
exports.index = (req, res, next) => {
    async.parallel({
        book_count: (callback) => {
            Book.count({}, callback);
        },  // Pass an empty object as match condition to find all documents of this collection
        book_instance_count: (callback) => {
            BookInstance.count({}, callback);
        },
        book_instance_available_count: (callback) => {
            BookInstance.count({status: 'Available'}, callback);
        },
        author_count: (callback) => {
            Author.count({}, callback);
        },
        genre_count: (callback) => {
            Genre.count({}, callback);
        },
    }, (err, results) => {
        res.send({title: 'Local Library Home', error: err, data: results})
    });
};

// 显示完整的book列表
exports.book_list = (req, res, next) => {
    Book.find({}, 'title author summary isbn')
        .populate({path:'author'})
        .populate({path:'genre'})
        .exec((err, list_books) => {
            if(err) {
                return next(err);
            }
            //Successful, so render
            res.send( {title: 'Book List', book_list: list_books});
        });
};

// 为每位book显示详细信息的页面
exports.book_detail = (req, res, next) => {
    async.parallel({
        book: (callback)=> {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance: (callback) => {
            BookInstance.find({'book': req.params.id})
                .exec(callback);
        },
    }, (err, results) => {
        if(err) {
            return next(err);
        }
        if (results.book == null) {  // No results
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.send( {title: 'Title', book: results.book, book_instances: results.book_instance});
    });
};
// 由GET显示创建book的表单
exports.book_create_get = (req, res, next) => {
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        authors: (callback) => {
            Author.find(callback);
        },
        genres: (callback) => {
            Genre.find(callback);
        }
    },(err, results) => {
        if (err, results) {
            res.send({title: 'Create Book', authors: results.authors, genres: results.genres});
        }
    });
};


// 由POST处理book创建操作
exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            }else{
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },
    // Validate fields.
    body('title', 'Title must not be empty.').isLength({min: 1}).trim(),
    body('author', 'Author must not be empty.').isLength({min: 1}).trim(),
    body('summary', 'Summary must not be empty.').isLength({min: 1}).trim(),
    body('isbn', 'ISBN must not be empty').isLength({min: 1}).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),
    sanitizeBody('genre.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escapted and trimmed data.
        var book = new Book({
            title: req.body.title,
            author: req.body.authors,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre 
        });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error message.

            // Get all authors and genres for form.
            async.parallel({
                authors: (callback) => {
                    Author.find(callback);
                },
                genres: (callback) => {
                    Genre.find(callback);
                }
            }, (err, results) => {
                if (err) {
                    return next(err);
                }

                // Mark our selected genres as checked.
                for(let i=0; i<results.genres.length; i++){
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.send( 
                    {title: 'Create Book', authors: results.authors, 
                        genres: results.genres, book: book, errors: errors.array()});
            });
            return;
        }else{
            // Data from form is valid. Save book.
            book.save((err) => {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to new book record.
                res.send({message: "create new book success!", newbookurl:book.url});
            });
        }
    }
];

// 由GET显示删除book的表单
exports.book_delete_get = function(req, res, next) {

    async.parallel({
        book: function(callback) {
            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
        },
        book_bookinstances: function(callback) {
            BookInstance.find({ 'book': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.book==null) { // No results.
            res.redirect('/catalog/books');
        }
        // Successful, so render.
        res.send({ title: 'Delete Book', book: results.book, book_instances: results.book_bookinstances } );
    });

};

// 由POST处理book删除操作
exports.book_delete_post = function(req, res, next) {

    // Assume the post has valid id (ie no validation/sanitization).

    async.parallel({
        book: function(callback) {
            Book.findById(req.body.id).populate('author').populate('genre').exec(callback);
        },
        book_bookinstances: function(callback) {
            BookInstance.find({ 'book': req.body.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.book_bookinstances.length > 0) {
            // Book has book_instances. Render in same way as for GET route.
            res.send({status:200, message: "delete book sucess", data: { title: 'Delete Book', book: results.book, book_instances: results.book_bookinstances }} );
            return;
        }
        else {
            // Book has no BookInstance objects. Delete object and redirect to the list of books.
            Book.findByIdAndRemove(req.body.id, function deleteBook(err) {
                if (err) { return next(err); }
                // Success - got to books list.
                res.send({message: "delete book objce sucess",books_list_url:'/catalog/books'});
            });

        }
    });

};

// 由GET显示更新book的表单
exports.book_update_get = (req, res, next) => {
    // Get book, authors and genres for form.
    async.parallel({
        book: (callback) => {
            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
        },
        authors: (callback) => {
            Author.find(callback);
        },
        genres: (callback) => {
            Genre.find(callback);
        }
    }, (err, results) => {
        if (err) {
            return next(err);
        }
        if (results.book == null) {  // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }

        // Success
        // Mark our selected genres as checked.
        for(var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
            for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++){
                if (results.genres[all_g_iter]._id.toString() == results.book.genre[book_g_iter]._id.toString()) {
                    results.genres[all_g_iter].checked = 'true';                    
                }
            }
        }
        res.send( 
            {
                title: 'Update Book',
                authors: results.authors, 
                genres: results.genres,
                book: results.book
            })
    });
};


// 由POST处理book更新操作
exports.book_update_post = [
    //Convert the genre to an array
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            }else{
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({min: 1}).trim(),
    body('author', 'Author must not be empty.').isLength({min: 1}).trim(),
    body('summary', 'Summary must not be empty.').isLength({min: 1}).trim(),
    body('isbn', 'ISBN must not be empty').isLength({min:1}).trim(),

    // Sanitize fields.
    sanitizeBody('title').trim().escape(),
    sanitizeBody('author').trim().escape(),
    sanitizeBody('summary').trim().escape(),
    sanitizeBody('isbn').trim().escape(),
    sanitizeBody('genre.*').trim().escape(),

    // Process request after validation and sanitization.
    (req,  res, next) => {
        // Extract  the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var book = new book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
            _id: req.params.id  // This is required, or a new ID will be assgined!
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: (callback) => {
                    Author.find(callback);
                },
                genres: (callback) => {
                    Genre.find(callback);
                }
            }, (err, results) => {
                if (err) {
                    return next(err);
                }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.send( 
                    {
                        title: 'Update Book',
                        authors: results.authors,
                        genres: results.genres,
                        book: book,
                        errors: errors.array()
                    });
            });
            return;
        }else{
            // Data from form is valid. Updated the record.
            book.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to book detail page.
                res.send({message: "update success!", url:thebook.url});
            });
        }
    }
];
