const Genre = require('../../models/genre');
const async = require('async');
const book = require('../../models/book');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// 显示完整的类目列表
exports.genre_list = (req, res, next) => {
    Genre.find()
        .sort([['name', 'ascending']])
        .exec((err, list_genres) => {
            if (err) {
                return next(err);
            }
            // Successful, so render
            res.send({sucess: 200,title: 'Genres List', genre_list: list_genres})
        });
};;

// 为每个类目显示详细信息的页面
exports.genre_detail = (req, res, next) => {
    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id)
                .exec(callback);
        },
        genre_books: (callback) => {
            book.find({'genre': req.params.id})
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
        res.send({title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
    });
};

// 由GET显示类目创建的表单
exports.genre_create_get = (req, res, next) => {
    res.send({title: 'Create Genre'});
};

// 由POST处理类目创建操作
exports.genre_create_post = [
    // Validate that the name field is not empty.
    body('name', 'Genre name require').isLength({min:1 }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization
    (req, res, next) => {
        //console.log(req);
        // Extract the validation errors from a request.
        const errors = validationResult(req);

       console.log(errors);
         // Create a genre object with escapted and trimmed data.
        var genre = new Genre(
            {name: req.body.name}
        );
        console.log(errors.isEmpty());
        if (!errors.isEmpty()) {
            console.log(errors.array());
            // There are errors. Render the form again with sanitized values/ error messages.
            res.send({title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({'name': req.body.name})
                .exec((error, found_genre) => {
                    if (error) {
                        return next(err);
                    }
                    if (found_genre) {
                        // Genre exists, redirect to its detail page.
                        res.send({message:"genre has been exists!" , url:found_genre.url});
                    } else {
                        genre.save((err) => {
                            if (err) {
                                return next(err);
                            }
                            // Genre saved. Redirect to genre detail page
                            res.send({message:"Genre create success!", newurl:genre.url});
                        });
                    }
                });
            
        }
    }

];

// 由GET显示删除类目的表单
exports.genre_delete_get = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            res.send({message: "Genere not found", url:'/catalog/genres'});
        }
        // Successful, so render.
        res.send({ title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
    });

};

// 由POST处理类目删除操作
exports.genre_delete_post = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.genre_books.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.send({ title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
            return;
        }
        else {
            // Genre has no books. Delete object and redirect to the list of genres.
            Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.send({message: "Genre has no books , Delete Object and redirect to the list of genres!", genre_list_url:'/catalog/genres'});
            });

        }
    });

};

// 由GET显示更新类目的表单
exports.genre_update_get = function(req, res, next) {

    Genre.findById(req.params.id, function(err, genre) {
        if (err) { return next(err); }
        if (genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.send({ title: 'Update Genre', genre: genre });
    });

};

// 由POST处理类目更新操作
exports.genre_update_post = [
   
    // Validate and sanitze the name field.
    body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
    

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        var genre = new Genre(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.send({ title: 'Update Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,thegenre) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.send({message:"update success!", url:thegenre.url});
                });
        }
    }
];

