var jwt = require('jsonwebtoken');
var CONFIG = require('../config.json');

function validateToken(req, res, next) {
  let token = req.headers.access_token;
  if (!token) {
    return res.status(400).json({ error: { message: "Missing authentication token." }})
  }
  jwt.verify(token, CONFIG.secret, function (err, decoded) {
    if (err) {
      return res.status(400).json({ error: { message: "Invalid auth token provided." }})
    }
    req.user = decoded.data;
    next();
  });
}
module.exports = validateToken;