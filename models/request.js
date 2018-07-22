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
  createdAt: Date,
  updatedAt: Date,
  status: String
});

//run functions before saving:
requestSchema.pre('save', function (next) {
  var request = this;
  var currentDate = new Date();
  request.updatedAt = currentDate;
  if (!request.createdAt) request.createdAt = currentDate;
  next()
});

module.exports = mongoose.model('Request', requestSchema);