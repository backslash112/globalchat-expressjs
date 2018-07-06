var controller = require('../../controllers/users');
var User = require('../../models/user');
var chai = require('chai');
var expect = chai.expect;
const app = require('../../app');
var supertest = require('supertest');


describe('controllers/users.js', () => {

  let user1 = new User({
    email: 'user1@gmail.com',
    password: '123456'
  });
  let user2 = new User({
    email: 'user2@gmail.com',
    password: '123456'
  });

  before(done => {
    controller.save(user1)
      .then(user => {
        // expect(user).to.have.property('_id').with.lengthOf(24);
        expect(user).to.have.property('email').with.lengthOf(user1.email.length);
        user1 = user;
        return controller.save(user2);
      })
      .then(user => {
        user2 = user;
        done();

        console.log(`user1: ${user1}`);
        console.log(`user2: ${user2}`);
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  after(done => {
    //user1.email, user2.email
    User.deleteMany({ email: { $in: [] } })
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should add each other to friend list.', (done) => {
    controller.addFriend(user1, user2)
      .then(users => {
        expect(users).to.have.lengthOf(2);
        users.map(function (user) {
          expect(user.friends).to.have.lengthOf(1);
        });
      })
      .catch(err => {
        console.log(err);
        done()
      });
  });

  // it('should remove friend from friend list.', (done) => {
  //   controller.unFriend(user1, user2)
  //     .then(friend => {
  //       expect(friend.friends).to.be.empty
  //       done();
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       done()
  //     });
  // });

  // it('should find the user by a correct email.', done => {
  //   controller.getUserByEmail(user1.email)
  //     .then(user => {
  //       expect(user.email).to.equal(user1.email);
  //       done();
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       done();
  //     })
  // });

});