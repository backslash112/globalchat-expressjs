'use strict';

// var Promise = require('promise');
var Promise = require('bluebird');
var User = require('../models/user');

function save(user) {
  return new Promise(function (resolve, reject) {
    user.hashPassword();
    user.save()
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
      .then((user1, user2) => {
        resolve([user1, user2]);
      })
      .catch(err => {
        reject(err);
      })
  });
}

function unFriend(user, friend) {
  return new Promise(function (resolve, reject) {
    const index = user.friends.findIndex(f => f.email === friend.email);
    if (index < 0)
      return reject(new Error("No such friend"));
    user.friends.splice(index, 1);
    user.save()
      .then(user => {
        resolve(user);
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = {
  save,
  getUserById,
  getUserByEmail,
  addFriend,
  unFriend
}