const SALTY_BITS = 10;

var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

// Define user
var UserSchema = mongoose.Schema({
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
  userName    : {
    type      : String,
    required  : true
  },
  email       : {
    type      : String,
    unique    : 'An account with this email address already exists',
    required  : `Please enter youe email address so that your friends can contact you. And don't worry we won't send you any spam.`,
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
  profileImg  : {
    type      : String,
    default   : '/images/default.png'
  },
  memberSince : {
    type      : Number,
    default   : () => Date.now();
  },
  family      : {
    type      : mongoose.Schema.ObjectId,
    ref       : 'Family'
  }
});

UserSchema.pre('save', function(next) {
  var user =this;

  if ( !user.isModified('password') ) {
    return next();
  }

  bcrypt.genSalt(SALTY_BITS, (saltErr, salt) => {
    if (saltErr) {
      return next(saltErr)
    }

    console.info('SALT generated!'.yellow, salt);

    bcrypt.hash(user.password, salt, (hashErr, hashedPassword) => {
      if (hashErr) {
        return next(hashErr);
      }

      user.password = hashedPassword;
      next();
    });
  });
});

// Export the user model
module.exports = mongoose.model('User', UserSchema);
