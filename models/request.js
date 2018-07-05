var mongoose = require('mongoose');
var userSchame = require('../models/user').schema;

var requestSchema = new mongoose.Schema({
  from: {
    user: userSchame
  },
  to: {
    user: userSchame
  },
  message: String,
  created_at: Date,
  updated_at: Date,
  status: String
});

//run functions before saving:
requestSchema.pre('save', function (next) {
  var request = this;
  var currentDate = new Date();
  request.updated_at = currentDate;
  if (!request.created_at) request.created_at = currentDate;
  next()
});

module.exports = mongoose.model('Request', requestSchema);