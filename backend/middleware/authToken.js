const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret");


exports.authToken = (req, res, next) => {
  let token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "need to send token!" })
  }
  try {
    let decodeToken = jwt.verify(token, secret.JWTSecretKey);
    req.userToken = decodeToken;
    next()
  }
  catch (err) {
    return res.status(401).json({ message: "invalid token or expired token, try login again" })

  }
}