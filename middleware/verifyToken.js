const jwt = require("jsonwebtoken");
const secretKey = "secretKey";
const Models=require("../models/index")
module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      const actualToken = token.split(" ")[1];
      jwt.verify(actualToken, secretKey, (err, authData) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token!" });
        }
        req.user = authData;
        next();
      });
    } else {
      return res.status(403).json({ message: "Token is not provided!" });
    }
  },
}