var mongoose = require('mongoose');

// Define user
var userSchema = mongoose.Schema({
  firstName   : {
    type      : String,
    trim      : true,
    required  : 'Please enter your first name'
  },
  lastName    : {
    type      : String,
    trim      : true,
    required  : 'Please enter your last name'
  },
  email       : {
    type      : String,
    unique    : 'An account with this email address already exists',
    required  : `Please enter youe email address so that your friends can contact you. And don't worry we won't send you any spam.`
    trim      : true,
    lowercase : true
  },
  phone       : {
    type      : Number,
    trim      : true,
    required  : `Please enter a phone number where your friends on Yakkee can contact you. And don't worry we won't be calling you.`
  },
  password    : {
    type      : String,
    required  : 'Please enter a password that is easy for you to remember but hard for others to guess.'
  },
  memberSince : {
    type      : Date,
    default   : Date.now
  },
  family      : {
    type      : mongoose.Schema.ObjectId,
    ref       : 'Family'
  }
})

Export the user model
module.exports = mongoose.model('User', userSchema);
