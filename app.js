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

httpServer.listen(8080, () => {
  console.log('http listening on 8080...')
});

// httpsServer.listen(443, () => {
//   console.log('https listening on 443...')
// });
const chat = io.of('/chat');

// Gets a list of client IDs connected to this namespace 
// via namespace.clients(callback) method: https://socket.io/docs/server-api/#namespace-clients-callback
function showConnectedSockets() {
  chat.clients((err, clients) => {
    console.log(`connected sockets: ${clients.length}: ${clients}`);
  });
}

function showConnectedUsers() {
  chat.clients((err, clients) => {
    let emails = [];
    for (let i = 0; i < clients.length; i++) {
      const connectedClient = chat.connected[clients[i]];
      const user = connectedClient.user;
      if (user) {
        emails.push(user.email);
      }
    }
    console.log(`joined users: ${emails.length}: ${emails}`);
  });
}
chat.on('connection', socket => {
  console.log('>connected!');
  // showConnectedSockets();
  socket.on('join', user => {
    console.log('joined room: ' + user.email);
    socket.join(user.email);

    // Save the user to his socket object
    socket['user'] = user;

    // socket.emit('joined', data);
    chat.emit('joined', user);

    showConnectedSockets();
    showConnectedUsers();

  });

  socket.on('leave', user => {
    console.log('leaved room: ' + user.email);
    socket.leave(user.email);
    socket.user = null;
    chat.emit('leaved', user);
    showConnectedSockets();
    showConnectedUsers();
  });

  socket.on('send_message', data => {
    socket.emit('sent');

    console.log(`send message[${data.message}] to room[${data.to}] via [new_message]`);
    socket.in(data.to).emit('new_message', { message: data.message, from: data.from });
  });

  socket.on('disconnect', () => {
    console.log('>disconnected!');
    showConnectedSockets();
  });
})

module.exports = app;
