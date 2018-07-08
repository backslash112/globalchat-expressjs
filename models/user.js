var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var CONFIG = require('../config.json');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, index: true, unique: true },
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date,
  gender: String,
  age: Number,
  friends: [{
    email: String,
    first_name: String,
    last_name: String
  }]
});

//run functions before save
userSchema.pre('save', function (next) {
  var user = this;
  var currentDate = new Date();
  user.updated_at = currentDate;
  if (!user.created_at) user.created_at = currentDate;
  next();
});

userSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({ email: email }, function (err, user) {
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

userSchema.methods.hashPassword = function () {
  // hashing a password before saving it to the database
  return new Promise(function (resolve, reject) {
    let user = this;
    // console.log('bcrypt.hash:');
    // console.log(user);
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        reject(err);
      } else {
        user.password = hash;
        resolve(user);
      }
    });
  }.bind(this)); // fix 'this' 
}

// https://stackoverflow.com/a/36795534/2195426
// userSchema.methods.generateToken = () => {
userSchema.methods.generateToken = function () {
  // Signing a token with 1 hour of expiration
  return jwt.sign({
    user: {
      _id: this._id,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }
  }, CONFIG.secret);
};
module.exports = mongoose.model('User', userSchema);