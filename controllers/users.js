'use strict';

// var Promise = require('promise');
var Promise = require('bluebird');
var User = require('../models/user');

function save(user) {
  return new Promise(function (resolve, reject) {
    // let hashPassword = user.hashPassword.bind(user);
    user.hashPassword()
      .then(user => user.save())
      .then(user => {
        resolve(user);
      })
      .catch(err => {
        reject(err);
      })
  });
}
function getUserById(userId) {
  return new Promise(function (resolve, reject) {
    User.findOneById(userId)
      .then(user => {
        resolve(user);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function getUserByEmail(email) {
  return new Promise(function (resolve, reject) {
    User.findOne({ email: email })
      .then(user => {
        resolve(user);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function addFriend(user1, user2) {
  user1.friends.push(user2);
  user2.friends.push(user1);
  return new Promise(function (resolve, reject) {
    Promise.join(user1.save(), user2.save())
      .then((users) => {
        resolve(users);
      })
      .catch(err => {
        reject(err);
      })
  });
}

function unFriend(user1, user2) {
  return new Promise(function (resolve, reject) {
    let index = user1.friends.findIndex(f => f.email === user2.email);
    if (index < 0)
      return reject(new Error('friend not found'));
    user1.friends.splice(index, 1);
    index = user2.friends.findIndex(f => f.email === user1.email);
    if (index < 0)
      return reject(new Error('friend not found'));
    user2.friends.splice(index, 1);
    Promise.join(user1.save(), user2.save())
      .then(users => {  // notice the different between 'then(users)' and join(user1.save(), user2.save(), function(user1, user2))
        resolve(users);
      })
      .catch(err => {
        reject(err);
      })
  });
}

function validateEmail(email) {
  return new Promise(function (resolve, reject) {
    User.findOne({ email: email })
      .then(user => {
        resolve(user);
      })
      .catch(err => {
        reject(err);
      })
  })
}
module.exports = {
  save,
  getUserById,
  getUserByEmail,
  addFriend,
  unFriend,
  validateEmail
}