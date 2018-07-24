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
    res.json(users);
  });
});

module.exports = router;