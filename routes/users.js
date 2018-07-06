var express = require('express');
var router = express.Router();

var User = require('../models/user');
var auth = require('../middlewares/auth.js');

// List all users
router.get('/', auth.validateToken, auth.loginRequired, function (req, res, next) {
  User.find({}, (err, users) => {
    if (err) {
      res.status(520).json({ error: { message: err } });
    } else {
      res.json({ "data": users });
    }
  });
});

// Create a new user
router.post('/', function (req, res, next) {
  let user = new User({
    password: req.body.password,
    email: req.body.email
  });
  user.save(err => {
    if (err) {
      if (err.code == 11000) {
        return res.status(409).json({ error: { message: 'email already taken' }});
      }
      res.status(520).json({ error: { message: err } });
    } else {
      res.json({ data: null });
    }
  });
});

module.exports = router;