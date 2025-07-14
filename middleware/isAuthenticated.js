const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../model/userModel");

const isAuthenticated = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      message: "Please login",
    });
  }

  // ✅ Support both "Bearer <token>" and just "<token>"
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const doesUserExist = await User.findById(decoded.id);

    if (!doesUserExist) {
      return res.status(404).json({
        message: "User doesn't exist with that token/id",
      });
    }

    req.user = doesUserExist;
    req.userId = doesUserExist._id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = isAuthenticated;
