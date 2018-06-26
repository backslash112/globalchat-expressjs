var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var CONFIG = require('../config.json');

var userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  username: { type: String, index: true, unique: true },
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date,
  gender: String,
  age: Number
});

//run functions before saving:
userSchema.pre('save', function (next) {
  var user = this;

  var currentDate = new Date();
  user.updated_at = currentDate;
  if (!user.created_at) user.created_at = currentDate;

  // hashing a password before saving it to the database
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

userSchema.statics.authenticate = function (username, password, callback) {
  this.findOne({ username: username }, function (err, user) {
    if (err) {
      return callback(err)
    } else if (!user) {
      var err = new Error('Authentication failed. User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        console.dir(`login success, got user: ${user}`)
        return callback(null, user);
      } else {
        var err = new Error('Authentication failed. Wrong password.');
        err.status = 401;
        return callback(err);
      }
    })
  });
}

// https://stackoverflow.com/a/36795534/2195426
// userSchema.methods.generateToken = () => {
userSchema.methods.generateToken = function () {
  // Signing a token with 1 hour of expiration
  return jwt.sign({
    user: {
      _id: this._id,
      username: this.username,
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }
  }, CONFIG.secret);
};
module.exports = mongoose.model('User', userSchema);