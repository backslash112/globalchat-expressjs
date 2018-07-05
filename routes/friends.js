var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Request = require('../models/request');
var auth = require('../middlewares/auth.js');
var handleError = require('../utils/res-utils.js').handleError;

// List all friends
router.get('/', auth.validateToken, auth.loginRequired, function (req, res, next) {
  User.findOne({ email: req.user.email }, 'friends', (err, friends) => {
    if (err) return handleError(err, res);
    res.json({ data: friends });
  });
});

// List all friend requests
router.get('/requests', auth.validateToken, auth.loginRequired, function (req, res, next) {
  Request.find({ to: req.user.email }, (err, requests) => {
    if (err) return handleError(err, res);
    res.json({ data: requests });
  });
});

// Send the friend request to a particular user
router.post('/requests', function (req, res, next) {
  let request = new Request({
    from: req.user,
    to: req.body.user
  });
  request.save((err, request) => {
    if (err) return handleError(err, res);
    res.json({ data: null });
  });
});

var RequestStatus = {
  Pending: "Pending",
  Accepted: "Accepted",
  Rejected: "Rejected",
  Deleted: "Deleted",
}

// Accept the friend request
router.put('/:id/requests', function (req, res, next) {
  Request.findById(req.body.id, (err, request) => {
    if (err) return res.status(520).json({ error: { message: err } });

    // update the request
    request.status = RequestStatus.Accepted;
    request.save((err, updatedRequest) => {
      if (err) return res.status(520).json({ error: { message: err } });

      // add friend to friend list for each other
      User.findOneAndUpdate({ email: request.to.user.email },
        { $push: { friends: request.from.user } }, (err, doc) => {
          if (err) return handleError(err, res);
          User.findOneAndUpdate({ email: request.from.user.email },
            { $push: { friends: request.to.user } }, (err, doc) => {
              if (err) return handleError(err, res);
              res.json({ data: null });
            }); // end User.findOneAndUpdate
        }); // end User.findOneAndUpdate
    }); // end request.save
  }); // end Request.findById
});

// Reject the friend request
router.delete('/:id/requests', function (req, res, next) {

});


// Unfriend with a particular user
router.delete('/:id', function (req, res, next) {
  User.findOneAndUpdate({ email: req.user.email },
    { $pull: { friends: { _id: req.params._id } } }, (err, user) => {
      if (err) return handleError(err, res);
      User.findByIdAndUpdate(req.params._id,
        { $pull: { friends: { email: req.user.email } } }, (err, user) => {
          if (err) return handleError(err, res);
          res.json({ data: null });
        }); // end User.findByIdAndUpdate
    }); // end User.findOneAndUpdate
});

module.exports = router;