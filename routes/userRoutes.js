const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  loginUser,
  disableUser,
  enableUser,
  updateUser,
} = require("../controllers/userController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.get("/", authenticate, isAdmin, getUsers);

router.post("/", authenticate, createUser);
router.post("/login", loginUser);

router.put("/:id", authenticate, updateUser);

router.put("/:id/enable", authenticate, isAdmin, enableUser);
router.put("/:id/disable", authenticate, isAdmin, disableUser);

module.exports = router;
