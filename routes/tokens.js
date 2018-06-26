
var express = require('express');
var router = express.Router();

var User = require('../models/user');

// login
router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username + ": " + password);
  User.authenticate(username, password, (err, user) => {
    if (err) {
      return res.json({
        "error": err
      });
    }
    let token;
    if (user) {
      token = user.generateToken();
    }
    res.json({ data: user, token: token })
  });
});

module.exports = router;