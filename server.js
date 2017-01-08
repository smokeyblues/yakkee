require('colors')

var express = require('express'),
    bodyParser = require('body-parser'),
    colors = require('colors'),
    morgan = require('morgan')('dev'),
    io = require('socket.io'),
    Routes = require('./routes'),
    port = process.env.PORT || 8080;

var app = express();

app.use(
  express.static(`public`),
  morgan
);

// Routes
Routes(app);

app.listen(port, ()=>{
  console.log(`Server running on ${port}`);
})
