const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send("No token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  next();
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).send("Access denied. Admins only.");
    }
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const isManager = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin" && user.role !== "manager") {
      return res.status(403).send("Access denied. Admins only.");
    }
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  isAdmin,
  authenticate,
  isManager,
};
