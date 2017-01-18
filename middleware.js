var User = require('./models/user');

module.exports = {
  isLoggedIn : (req, res, next) => {
    if (req.session.userID) {
      next()
    } else {
      res.status(403).send('Permission denied');
    }
  }
}
