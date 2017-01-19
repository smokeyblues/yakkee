require('colors');
var config = require('./config.js');

var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    colors = require('colors'),
    morgan = require('morgan')('dev'),
    socketIO = require('socket.io'),
    Routes = require('./routes'),
    port = process.env.PORT || 7788,
    app = express(),
    sessions = require('client-sessions')({
      cookieName : "0_o",
      secret : config.sessionsSecret,
      requestKey : "session",
      cookie : {
        httpOnly : true
      }
    });

mongoose.connect("mongodb://localhost/yakkee", (err)=>{
  if(err){
    return console.log("DB failed to connect".red, err);
  }
  console.log("mongoDB connected".cyan);
});

app.use(
  express.static(`public`),
  bodyParser.json(),
  bodyParser.urlencoded({extended : true}),
  morgan,
  sessions
);

// Routes
Routes(app);

var server =http.createServer(app);
var io = socketIO.listen(server);
io.sockets.on('connection', function(socket) {

  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var numClients = io.sockets.sockets.length;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 1) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);

    } else if (numClients === 2) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function(){
    console.log('received bye');
  });

});

server.listen(port, ()=>{
  console.log(`Server running on ${port}`);
})
