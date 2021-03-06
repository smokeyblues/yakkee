require('colors');
var config = require('./config.js');

var express = require('express'),
    HTTP = require('http'),
    HTTPS = require('https'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    colors = require('colors'),
    morgan = require('morgan')('dev'),
    socketIO = require('socket.io'),
    Routes = require('./routes'),
    fs = require('fs'),
    ports = {
      http:   process.env.PORT || 80,
      https:  process.env.PORT_SSL || 443
    },
    httpsConfig = {
      key:    fs.readFileSync('/etc/letsencrypt/live/yakkee.com/privkey.pem'),
      cert:   fs.readFileSync('/etc/letsencrypt/live/yakkee.com/cert.pem')
    },
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

var httpServer = HTTP.createServer( app ).listen( ports.http, ()=>{
  console.log(`Server listening on port ${ports.http}`);
} );

try {
  var httpsServer = HTTPS.createServer( httpsConfig, app ).listen( ports.https, ()=>{
    console.log(`HTTPS Server listening on port ${ports.https}`);
  } );
} catch (e) {
  console.error('Could not HTTPS server', e);
}

app.all('*', (req, res, next )=> {
  if ( req.protocol === 'http' ) {
    res.set('X-Forwarded-Proto', 'https');
    res.redirect('https://' + req.headers.host + req.url);
  } else {
    next();
  }
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

var io = socketIO.listen(httpsServer);
io.on('connection', function(socket) {
  console.log(`Socket 'connection' event triggered`);
  socket.on('signedIn', function (user) {
    console.log(`'signedIn' event was triggered`);
    var roomName = 'room' + user._id;
    console.log('roomName', roomName);
    socket.join(roomName);
    console.log(`${user.displayName} joined ${roomName}`);
    console.log("All Rooms: ");
    console.log(io.nsps['/'].adapter.rooms);
  });

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

  //listening for emit from main.js line 11
  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var numClients = io.sockets.sockets.length;
    // console.log('io.sockets.sockets object: '.yellow, io.sockets.sockets);
    // log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients <= 1 || undefined) {
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

  socket.on('callCancelled', function(roomName) {
    console.log("callCancelled function was triggered, data returned: ", roomName);
    socket.join(roomName);
    socket.broadcast.to(roomName).emit('cancelInvite');
  });

  // Just kidding the notes start here fool! But since you are here anyway let's talk about what 'vcInviteReceived' does

  // 'vcInviteReceived' takes inviteData as an argument. inviteData is an object that contains info on from.sender and to.user. The two parties in this exchange and the url string for the videochat room that will build the videochat room url.

  // 1. determine chatroom name that invite has to be sent to.
      // format : the word 'room' with the receiver's mongo id added - no space. ie. 'room' + inviteData.receiver._id

  // 2. building inviterMessage. I don't think this is used.

  // 3. joins receiver's chat room

  // 4. broadcasts event 'triggerInvite' to recipient's room.

  // 'triggerInvite' is being listened for on line 51 of controller.home.js

  socket.on('vcInviteReceived', function(inviteData) {
    console.log('vcInviteReceived was triggered');
    var inviteeRoom = `room${inviteData.receiver._id}`
    console.log('inviteeRoom: ', inviteeRoom);
    var inviterMessage = `Hi from ${inviteData.sender.firstName} ${inviteData.sender.lastName}`
    console.log(`An invite to ${inviteData.link} was sent to ${inviteData.receiver.firstName} ${inviteData.receiver.lastName}, line 127 of server.js`);
    socket.join(inviteeRoom);
    socket.broadcast.to(inviteeRoom).emit('triggerInvite', inviteData);
    console.log(`triggerInvite to ${inviteData.receiver.firstName} ${inviteData.receiver.lastName} should have been emitted`);
  });

  socket.on('yourInviteWasAccepted', function(rsvp) {
    socket.broadcast.to('room' + rsvp.sender._id).emit('hcYourInviteWasAccepted', rsvp);
  });

  socket.on('bye', function(){
    console.log('received bye');
  });

});

// server.listen(port, ()=>{
//   console.log(`Server running on ${port}`);
// })
