const jwt = require("jsonwebtoken");
const config = require("config");

// Like auth, but lets anonymous requests through without req.user
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (token) {
    try {
      req.user = jwt.verify(token, config.get("jwtPrivateKey"));
    } catch (ex) {
      // Invalid token: continue as an anonymous visitor
    }
  }
  next();
};
