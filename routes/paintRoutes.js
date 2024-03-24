const express = require("express");
const router = express.Router();
const {
  getPaints,
  createColor,
  updatePaintStatus,
  updatePaintInventory,
  updateMultiplePaintsInventory,
} = require("../controllers/paintController");
const {
  authenticate,
  isAdmin,
  isManager,
} = require("../middleware/authMiddleware");

router.get("/", authenticate, getPaints);
router.put("/:color/status", authenticate, updatePaintStatus);
router.put("/:color/inventory", authenticate, updatePaintInventory);
router.put(
  "/bulk-update",
  authenticate,
  isManager,
  updateMultiplePaintsInventory
);

router.post("/", authenticate, isAdmin, createColor);

module.exports = router;
