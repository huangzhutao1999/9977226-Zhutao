var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var jwt = require('jwt-simple');
var cors = require('cors');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


// dev
const config = require('./config/dev');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var wikiRouter = require('./routes/wiki');
var catalogRouter = require('./routes/catalog');
var apiRouters = require('./routes/api');

var app = express();

// accept cross site 
app.use(cors())
// app.use(cors({
//   origin: [config.ogrigin],
//   allowedHeaders: ['Conten-Type','Authorization','Accept','Origin'],
//   methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTINS',
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   credentials: true
// }));

// var allowCrossDomain = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials','true');
//   next();
// };
// app.use(allowCrossDomain);

app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: config.dbUrl
  })
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));


app.use(expressJWT({
  secret: TOKEN_KEY
}).unless({    // white list , don't use to authenticate
  path: [
    '/api/register',
    '/api/login',
    '/api/login/logout',
    '/api/index',
    '/api/booklist',
    '/api/book/:id',
    '/api/bookinstancelist',
    '/api/bookinstance/:id',
    '/api/authorlist',
    '/api/author/:id',
    '/api/genrelist',
    '/api/genre/:id',
    '/api/search',

  ]
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/wiki', wikiRouter);
app.use('/catalog', catalogRouter);
app.use('/api', apiRouters);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  if (err.name === 'UnauthorizedError') {
    res.status(404).send({ code: -1, msg: 'token error' }) ；
  } else {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
