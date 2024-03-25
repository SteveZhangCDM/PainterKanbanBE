const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @route   /api/users
// @access  Private
const createUser = async (req, res) => {
  try {
    const { userName, password, fullName, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      password: hashedPassword,
      fullName,
      role,
    });

    if (newUser) {
      res.status(201).json("New user has created");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// @desc    Get all users
// @route   /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    login a user
// @route   /api/users/login
// @access  Private
const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName }).select("+password");

    if (!user) {
      return res.status(404).json("User not found");
    }

    if (user.isActive === false) {
      return res.status(403).json("Account has been deactivated");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }

    user.password = undefined;

    // jtw token
    const token = jwt.sign(
      { id: user._id, userName: user.userName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "60d" }
    );

    res.status(200).json({
      token,
      user: { id: user._id, userName: user.userName, role: user.role },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// @desc    Update a user profile
// @route   /api/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const { id } = req.params;
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }
    await User.findByIdAndUpdate((_id = id), updates);
    res.status(200).json("User updated successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// @desc    Enable a user
// @route   /api/:id/enable
// @access  Private
const enableUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate((_id = id), { isActive: true });
    res.status(200).json("User enabled successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// @desc    Disable a user
// @route   /api/:id/disable
// @access  Private
const disableUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate((_id = id), { isActive: false });
    res.status(200).json("User disabled successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createUser,
  getUsers,
  loginUser,
  disableUser,
  enableUser,
  updateUser,
};
