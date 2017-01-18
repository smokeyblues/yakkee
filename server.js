require('colors');
var config = require('./config.js');

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    colors = require('colors'),
    morgan = require('morgan')('dev'),
    io = require('socket.io'),
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

app.listen(port, ()=>{
  console.log(`Server running on ${port}`);
})
