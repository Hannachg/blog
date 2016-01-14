var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session =require('express-session');
var bodyParser = require('body-parser');
var falsh =require('connect-flash');
var MongoStore =require('connect-mongo')(session);
var Setting = require('./setting');

var routes = require('./routes/index');
// var users = require('./routes/users');
// var post =require('./routes/post');
// var reg =require('./routes/reg');
// var login =require('./routes/login');
// var logout =reqiure('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(falsh())
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:Setting.cookieSecret,
  store:new MongoStore({
    db:Setting.db
  })
}));

app.use('/', routes);
// app.use('/users', users);
// app.use('/post',post);
// app.use('/login',login);
// app.use('/logout',logout);
// app.use('/reg',reg);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.get('/',routes);   //routes.index
// app.get('/u/:user',routes.user);
// app.post('/post',post);
// app.get('/reg',reg);
// app.post('/reg',reutes.doReg);
// app.get('/login',login);
// app.post('/login',routes.doLogin);
// app.get('/logout',logout);

app.listen(3000);

module.exports = app;
