'use strict';

var Promise = require('bluebird');
var Room = require('../models/room');

/**
 * Get a room object from DB, if the room already exist in the db, then return it,
 * else create a new room into DB and return it.
 * @param {User Object} user1 The first participator in one conversation
 * @param {User Object} user2 The second participator in one conversation
 */
function getRoomByParticipators(user1, user2) {
  let roomId = user1.email > user2.email
    ? user1.email + user2.email
    : user2.email + user1.email;
  return new Promise(function (resolve, reject) {
    Room.findOne({ roomId: roomId }).then(room => {
      if (room) return resolve(room);

      const newRoom = new Room({
        roomId: roomId,
        users: [user1, user2]
      });
      newRoom.save()
        .then(room => {
          resolve(room);
        })
        .catch(err => {
          reject(err);
        })
    })
  })
}

function getRoomById(roomId) {
  return new Promise(function (resolve, reject) {
    const query = { roomId: roomId };
    Room.findOne(query)
      .then(room => {
        resolve(room);
      })
      .catch(err => {
        reject(err);
      })
  });
}
/**
 * Save message to DB.
 * @param {String} roomId The room ID of the conversation
 * @param {Message Object} message The message need to save
 */
function saveMessageByRoomId(roomId, message) {
  return new Promise(function (resolve, reject) {
    const query = { roomId: roomId };
    Room.findOneAndUpdate(query, { $push: { messages: message } }, { new: true }).then(room => {
      resolve(room);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * save message to DB.
 * @param {Room Object} room 
 * @param {Message Object} message 
 */
function saveMessageByRoom(room, message) {
  return new Promise(function (resolve, reject) {
    const query = { roomId: room.roomId };
    Room.findOneAndUpdate(query, { $push: { messages: message } }).then(room => {
      resolve(room);
    }).catch(err => {
      reject(err);
    })
  });
}

function deleteRoomById(roomId) {
  return new Promise(function (resolve, reject) {
    Room.deleteOne({ roomId: roomId })
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      })
  });
}
module.exports = {
  getRoomByParticipators,
  saveMessageByRoom,
  saveMessageByRoomId,
  getRoomById,
  deleteRoomById
}