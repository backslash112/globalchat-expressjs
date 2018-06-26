var express = require('express');
var router = express.Router();

var User = require('../models/user');
var auth = require('./middlewares/auth.js');

// List all users
router.get('/', auth.loginRequired, auth.validateToken, function (req, res, next) {
  User.find({}, (err, users) => {
    if (err) {
      res.json({ error: { message: err } });
    } else {
      res.json({ "data": users });
    }
  });
});

// Create a new user
router.post('/', function (req, res, next) {
  let user = new User({
    password: req.body.password,
    user_name: req.body.userName
  });
  user.save(err => {
    if (err) {
      res.json({ error: { code: 520, message: err } });
    } else {
      res.json({ data: null });
    }
  });
});

module.exports = router;