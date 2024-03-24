const Paint = require("../models/paintModel");

// @desc    Get all paints
// @route   /api/paints
// @access  Private
const getPaints = async (req, res) => {
  try {
    const paints = await Paint.find({});

    res.status(200).json(paints);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// @desc    Update one paint status
// @route   /api/paint/:color/status
// @access  Private
const updatePaintStatus = async (req, res) => {
  try {
    const { color } = req.params;
    const { status } = req.body;
    await Paint.findOneAndUpdate({ color }, { status });
    res.status(200).json("Paint status updated successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// @desc    Update one paint inventory
// @route   /api/paint/:color/inventory
// @access  Private
const updatePaintInventory = async (req, res) => {
  try {
    const { color } = req.params;
    const { quantity } = req.body;

    const paint = await Paint.findOne({ color });

    if (!paint) {
      return res.status(404).json("Color not found.");
    }

    paint.quantity = Number(quantity);

    if (paint.quantity <= 0) {
      paint.quantity = 0;
      paint.status = "out of stock";
    }

    await paint.save();
    res.status(200).json("Paint inventory updated successfully.");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// @desc    Update multiple paints inventory
// @route   /api/paints/bulk-update
// @access  Private
const updateMultiplePaintsInventory = async (req, res) => {
  try {
    const { bulk } = req.body;

    if (!Array.isArray(bulk)) {
      return res.status(400).json("Input must be an array of updates.");
    }

    await Promise.all(
      bulk.map(async (e) => {
        const paint = await Paint.findOne({ color: e.color });

        if (paint) {
          paint.quantity = e.quantity;

          if (paint.quantity <= 0) {
            paint.quantity = 0;
            paint.status = "out of stock";
          }

          await paint.save();
        }
      })
    );

    res.status(200).json("Paint inventories updated successfully.");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// @desc    Create one new paint
// @route   /api/paints/
// @access  Private
const createColor = async (req, res) => {
  try {
    const { color, status, quantity } = req.body;

    const colorExists = await Paint.findOne({ color });
    if (colorExists) {
      return res.status(400).json("Color already exists.");
    }

    const newColor = new Paint({
      color,
      status,
      quantity,
    });

    await newColor.save();
    res.status(201).json("Color created successfully.");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  getPaints,
  updatePaintStatus,
  updatePaintInventory,
  updateMultiplePaintsInventory,
  createColor,
};
