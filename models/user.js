var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var CONFIG = require('../config.json');

var userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    user_name: {type: String, index: true, unique: true},
    password: { type: String, required: true },
    created_at: Date,
    updated_at: Date,
    date_of_birth: Date,
    gender: String,
    location: { country: String, state: String, city: String, zipcode: String, coordinates: { type: Array, 'default': [0, 0] }}
});

//custom methods:
userSchema.methods.fullName = function(){
    return this.first_name + ' '+ this.last_name;
}

//statics:
userSchema.static.findByName = function(name, cb){
    return this.find({user_name: name}, cb);
}
//run functions before saving:
userSchema.pre('save', function(next){
    var user = this;

    var currentDate = new Date();
    user.updated_at = currentDate;
    if(!user.created_at)user.created_at = currentDate;
    
    // hashing a password before saving it to the database
    bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
    })
});

//query helpers
userSchema.query.byUserName = function(userName){
    return this.find({user_name: userName});
}

//virtuals:
userSchema.virtual('full_name')
.get(function(){
    return this.first_name + ' ' + this.last_name;
})
.set(function(v){
    this.first_name = v.substr(0, v.indexOf(' '));
    this.last_name = v.substr(v.indexOf(' ')+1);
})

userSchema.statics.authenticate = function (user_name, password, callback) {
    this.findOne({ user_name: user_name }, function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('Authentication failed. User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            var err = new Error('Authentication failed. Wrong password.');
            err.status = 401;
            return callback(err);
          }
        })
      });
  }

userSchema.methods.generateToken = () => {
    // Signing a token with 1 hour of expiration
    return jwt.sign({
        _id: this._id,
        user_name: this.user_name,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, CONFIG.secret);
};
module.exports = mongoose.model('User', userSchema);