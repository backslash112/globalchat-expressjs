var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tokensRouter = require('./routes/tokens');

var CONFIG = require('./config.json');
var dbPort = CONFIG.dbPort;
var dbHost = CONFIG.dbHost;
var dbUser = CONFIG.dbUser;
var dbPwd = CONFIG.dbPwd;
var dbName = CONFIG.dbName;
var mongoose = require('mongoose');
mongoose.connect(`mongodb://${dbUser}:${dbPwd}@${dbHost}:${dbPort}/${dbName}`);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var v1 = express.Router();
v1.use('/users', usersRouter);
v1.use('/tokens', tokensRouter);
app.use('/v1', v1);
app.use('/', v1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log('listening on 3000...')
});

module.exports = app;
