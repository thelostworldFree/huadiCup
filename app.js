var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var toobusy = require('toobusy-js');

var routes = require('./routes/index');
var users = require('./routes/users');
var addcomic = require('./routes/addcomic');
var comicpage = require('./routes/comicpage');
var profile = require('./routes/profile');
var homepage = require('./routes/homepage');
var search = require('./routes/search');
var writeuserreview = require('./routes/writeuserreview');
var readuserreview = require('./routes/readuserreview');
var writecomicreview = require('./routes/writecomicreview');
var readcomicreview = require('./routes/readcomicreview');
var message = require('./routes/message');
var rentals = require('./routes/rentals');
var http = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: 'keyboard cat',
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "Too many requests at once");
  } else {
    next();
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users(passport));
app.use('/profile', profile);
app.use('/addcomic', addcomic);
app.use('/comicpage', comicpage);
app.use('/homepage', homepage);
app.use('/search', search);
app.use('/writeuserreview', writeuserreview);
app.use('/readuserreview', readuserreview);
app.use('/writecomicreview', writecomicreview);
app.use('/readcomicreview', readcomicreview);
app.use('/message', message);
app.use('/rentals', rentals);


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

//设置端口号
//app.set('port', process.env.PORT || 3000);
//http.createServer(app).listen(app.get('port'),function(){
//  console.log('Express服务器监听端口 : http://localhost:' + app.get('port'));
//});

module.exports = app;