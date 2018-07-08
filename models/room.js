'use strict';

var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
  roomId: { type: String, index: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  users: [{ email: String, firstName: String, lastName: String, language: String }],
  messages: [{
    from: { email: String, firstName: String, lastName: String, language: String },
    createdAt: { type: Date, default: Date.now },
    content: {
      origin: { text: String, language: String },
      target: { text: String, language: String }
    }
  }],
});

module.exports = mongoose.model('Room', roomSchema);
