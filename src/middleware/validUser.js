const JWT = require("jsonwebtoken");
const User = require("../model/User");

const checkValidUser = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) return res.status(400).json({ message: "Token not found!" });
  try {
    const isValid = JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const foundUser = await User.findOne({ username: isValid?.username });
    if (!foundUser) return res.status(401).json({ message: "Invalid user. Please login again!" });
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = checkValidUser;
