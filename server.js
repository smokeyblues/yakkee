require('colors')

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    colors = require('colors'),
    morgan = require('morgan')('dev'),
    io = require('socket.io'),
    Routes = require('./routes'),
    port = process.env.PORT || 8080;

var app = express();

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
  morgan
);

// Routes
Routes(app);

app.listen(port, ()=>{
  console.log(`Server running on ${port}`);
})
