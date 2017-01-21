var Users = require('./controllers/users');
var User = require('./models/user');
var Middleware = require('./middleware');
var mongoose = require('mongoose');
var multiparty = require('connect-multiparty');

module.exports = (app)=>{
  app.get('/', (req, res)=>{
    res.sendFile('index.html', {root : './public/html'});
  });

  app.get('/api/me', (req, res)=>{
    console.log(req.session.userID)
    User.findById(req.session.userID, (err, user)=>{
      res.send(user)
    })
  });

  app.get('/logout', (req, res)=>{
    console.log("hey the logout is running!");
    req.session.reset();
    res.send(200)
  });

  app.get('/api/users', Middleware.isLoggedIn, Users.get);
  app.post('/api/users', multiparty, Users.create);
  app.post('/api/users/login', Users.login);

  // app.get('/video-yak/:videoRoomID', (req, res)=>{
  //   res.sendFile('videochat.html', {root : './public/html'});
  // })

  // very last route
  app.get('*', (req, res)=>{
    res.sendFile('index.html', {root : './public/html'});
  })
}
