'use strict';
var Promise = require('bluebird');
var roomController = require('./room');

/**
 * Translate text
 * @param {String} source The origin source need to be translate
 * @param {String} sourceLanguage The origin source language
 * @param {String} targetLanguage The target language needed
 */
function translateText(source, sourceLanguage, targetLanguage) {
  return new Promise(function (resolve, reject) {
    resolve(origin + "xxx");
  });
}

/**
 * Translate message object
 * @param {Message Object} message The origin message object need to be translate
 */
function translate(message) {
  return new Promise(function (resolve, reject) {
    const source = message.content.origin.text;
    const sourceLanguage = message.content.origin.language;
    const targetLanguage = message.content.target.language;
    translateText(source, sourceLanguage, targetLanguage)
      .then(result => {
        message.content.target.text = result;
        resolve(message);
      })
      .catch(err => {
        reject(err);
      })
  });
}

/**
 * Save one message to DB
 * @param {Message Object} message The message need to save to the DB
 */
function save(message) {
  message.roomId = message.from.email > message.to.email
    ? message.from.email + message.to.email
    : message.to.email + message.from.email;
  return roomController.saveMessageByRoomId(message.roomId, message);;
}

module.exports = {
  translate,
  save
}