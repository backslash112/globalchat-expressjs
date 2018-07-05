var mongoose = require('mongoose');

var requestSchema = new mongoose.Schema({
  from: {
    user: {
      email: String, 
      username: String, 
      first_name: String, 
      last_name: String
    }
  },
  message: String,
  created_at: Date,
  updated_at: Date
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