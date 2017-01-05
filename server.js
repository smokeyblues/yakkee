var express = require('express'),
    morgan = require('morgan')('dev'),
    io = require('socket.io'),
    port = process.env.PORT || 8080;

var app = express();

app.use(
  express.static(`public`)
)

app.listen(port, ()=>{
  console.log(`Server running on ${port}`);
})
