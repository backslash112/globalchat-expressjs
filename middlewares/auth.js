var jwt = require('jsonwebtoken');
var CONFIG = require('../config.json');


function validateToken(req, res, next) {
  let token = req.headers.access_token;
  console.log(`token: ${token}`)
  if (!token) {
    return res.status(499).json({ error: { message: "Missing authentication token." }})
  }
  jwt.verify(token, CONFIG.secret, function (err, decoded) {
    if (err) {
      return res.status(498).json({ error: { message: "Invalid auth token provided." }})
    }
    req.user = decoded.user;
    next();
  });
}


function loginRequired(req, res, next) {
  if (req.user) {
      next();
  } else {
    return res.status(401).json({ error: { message: 'Unauthorized user!' }});
  }
}

module.exports = { 
  loginRequired, 
  validateToken 
}