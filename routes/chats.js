var express = require('express');
var router = express.Router();

router.get("/online-users", function (req, res, next) {
  const ioChat = req.ioChat;
  ioChat.clients((err, clients) => {
    let users = [];
    for (let i = 0; i < clients.length; i++) {
      const connectedClient = ioChat.connected[clients[i]];
      const user = connectedClient.user;
      if (user) {
        users.push(user);
      }
    }

    // remove duplicate items
    users = users.filter((obj, index, users) => {
      return users.map(user => user['email']).indexOf(obj['email']) === index;
    });
    // remove current user
    // users = users.filter(user => {
    //   return user.email != req.user.email
    // });
    res.json({ data: users });
  });
});

module.exports = router;