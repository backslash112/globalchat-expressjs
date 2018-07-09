var controller = require('../../controllers/rooms');

var chai = require('chai');
var expect = chai.expect;

describe('controllers/rooms.test.js', () => {

  let user1 = { email: 'user1@gmail.com' };
  let user2 = { email: 'user2@gmail.com' };
  let expectRoomId = user1.email > user2.email
    ? user1.email + user2.email
    : user2.email + user1.email

  before(done => { done() });
  after(done => {
    controller.deleteRoomById(expectRoomId)
      .then(() => {
        done();
      })
  });


  it('should can get a room by two participators', done => {
    controller.getRoomByParticipators(user1, user2)
      .then(room => {
        expect(room).to.have.property('_id');
        expect(room).to.have.property('roomId', expectRoomId);
        done();
      })
  });

  it('should can get a room object from DB by an exist roomId', done => {
    controller.getRoomById(expectRoomId)
      .then(room => {
        console.log('got room:');
        expect(room).to.not.be.null;
        expect(room).to.have.property('roomId');
        expect(room.roomId).to.equal(expectRoomId);
        done();
      })
  });
  it('should can save message to room', done => {
    const message = {
      from: user1,
      to: user2,
      content: {
        origin: { text: 'hello', language: 'en' },
        target: { text: '你好', language: 'cn' }
      }
    }
    controller.saveMessageByRoomId(expectRoomId, message)
      .then(room => {
        expect(room).to.have.property('messages');
        expect(room.messages).to.have.lengthOf(1);
        done();
      })
      .catch(err => {
        throw err;
      })
  })
});