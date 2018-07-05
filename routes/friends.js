var express = require('express');
var router = express.Router();

var User = require('../models/user');
var auth = require('../middlewares/auth.js');

// List all friends
router.get('/', auth.validateToken, auth.loginRequired, function (req, res, next) {
  User.find({}, (err, users) => {
    if (err) {
      res.status(520).json({ error: { message: err } });
    } else {
      res.json({ "data": users });
    }
  });
});

// List all friend requests
router.get('/requests', auth.validateToken, auth.loginRequired, function(req, res, next) {

});

// Send the friend request to a particular user
router.post('/requests', function (req, res, next) {
  let user_id = eq.body.user_id;
  user.save(err => {
    if (err) {
      if (err.code == 11000) {
        return res.status(409).json({ error: { message: 'username already taken' }});
      }
      res.status(520).json({ error: { message: err } });
    } else {
      res.json({ data: null });
    }
  });
});

// Accept the friend request
router.put('/:id/requests', function(req, res, next) {

});

// Reject the friend request
router.delete('/:id/requests', function(req, res, next) {

});


// Unfriend with a particular user
router.delete('/:id', function(req, res, next) {

});

module.exports = router;