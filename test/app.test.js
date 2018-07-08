var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var io = require('socket.io-client');

describe('app.js', () => {

  var socketURL = "http://0.0.0.0:8080/chat";
  let user1 = { email: 'user1@gmail.com' };
  let user2 = { email: 'user2@gmail.com' };
  let client1;
  let client2;
  beforeEach(done => {
    client1 = io.connect(socketURL);
    client2 = io.connect(socketURL);
    done();
  });

  afterEach(done => {
    client1.disconnect();
    client2.disconnect();
    done();
  });

  it('should can connect to the server.', (done) => {
    client1.on('connect', () => {
      expect(client1).to.be.not.null;
      expect(client1).to.have.property('id');
      done();
    });
  });


  it('should can join a room', (done) => {
    client1.on('joined', () => {
      done();
    });
    client1.emit('join', { room: user1.email });
  });

  it('should can leave a room', done => {
    client1.on('leaved', () => {
      done();
    });
    client1.emit('leave', { room: user1.email });
  });

  it('should can send msg to a room', done => {
    client1.on('sent', () => {
      done();
    });
    client1.emit('send_msg', { to: user2.email });
  });


  it('should can receive msg from other via room', done => {
    const msg = 'hello, my name is user1.';
    client2.on('joined', () => {
      client1.emit('send_msg', { to: user2.email, msg: msg });
    });
    client2.emit('join', { room: user2.email });
    client2.on('new_msg', data => {
      expect(data.msg).to.equal(msg);
      done();
    });
  });

  it('should not can receive msg from other via room after leave that room', done => {
    let numMsgs = 0;
    client2.on('new_msg', data => {
      numMsgs++;
      client2.emit('leave', { room: user2.email });
    });

    client2.on('joined', () => {
      client1.emit('send_msg', { to: user2.email, msg: '' });
    });
    client2.on('leaved', () => {
      client1.emit('send_msg', { to: user2.email, msg: '' });
    });

    client2.emit('join', { room: user2.email });

    setTimeout(() => {
      expect(numMsgs).to.equal(1);
      done();
    }, 1000);

  });
});