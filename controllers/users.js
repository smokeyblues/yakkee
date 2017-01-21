//require model
var User = require('../models/user');
var bcrypt = require('bcryptjs');

//Export route handlers
module.exports = {

  get : (req, res)=>{
    User.find({}, (err, users)=>{
      if (err) {
        console.log("Something bad happened! USER-GET".red);
        return res.send(err)
      }

      res.send(users);

    })
  },

  create : (req, res)=>{
    // Creating registering a new user

    var yakker = new User(req.body.data);

    yakker.save((err, doc)=>{
      if (err) {
        console.log('failed to save user');
        return res.send(err);
      }
      req.session.userID = doc._id
      res.send(doc)
    });
  },

  login : (req, res)=>{
    User.findOne({userName : req.body.userName}, (err, user)=>{

      if (err) {
        return res.send(err)
      }

      if (!user) {
        return res.send("No user by that name exists")
      }

      bcrypt.compare(req.body.password, user.password, (err, matched)=>{
        if (err) {
          return res.send(err)
        }

        if (!matched) {
          return res.send("Password does not match")
        }

        req.session.userID = user._id
        res.send(user);
      })
    })
  }
}
