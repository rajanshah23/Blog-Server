const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../model/userModel");

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Please login" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Extract token

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const doesUserExist = await User.findOne({ _id: decoded.id });

    if (!doesUserExist) {
      return res
        .status(404)
        .json({ message: "User doesn't exist with that token/id" });
    }

    req.user = doesUserExist;
    req.userId = doesUserExist._id;

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
