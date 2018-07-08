var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/users');
var tokensRouter = require('./routes/tokens');
var cors = require('cors');
var helmet = require('helmet')
var fs = require('fs');

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
app.use(cors())
app.use(helmet())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set version of API
var v1 = express.Router();
v1.use('/users', usersRouter);
v1.use('/tokens', tokensRouter);
app.use('/v1', v1);
app.use('/', v1);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ "error": err });
});


var httpServer = require('http').createServer(app);
// const options = {
//   cert: fs.readFileSync('./sslcert/fullchain.pem'),
//   key: fs.readFileSync('./sslcert/privkey.pem')
// };
// var httpsServer = require('https').createServer(options, app)
var io = require('socket.io')(httpServer)

httpServer.listen(80, () => {
  console.log('http listening on 80...')
});

// httpsServer.listen(443, () => {
//   console.log('https listening on 443...')
// });

io.of('/chat').on('connection', socket => {
  //console.log('>connected!');
  socket.on('join', data => {
    // console.log('joined room: ' + data.room);
    socket.join(data.room);
    socket.emit('joined');
  });
  socket.on('leave', data => {
    // console.log('leaved room: ' + data.room);
    socket.leave(data.room);
    socket.emit('leaved');
  });

  socket.on('send_msg', data => {
    socket.emit('sent');
    // console.log(`send msg[${data.msg}] to room[${data.to}] via [new_msg]`);
    socket.in(data.to).emit('new_msg', { msg: data.msg });
  });

  socket.on('disconnect', () => {
    // console.log('>disconnected!');
  });
})
module.exports = app;
