const express = require("express");
const {Menu} = require("../models/menu");
const { menu } = require('../constant/constant');

const router = express.Router();

// ✅ GET all menus for a specific user
router.get("/:id", async (req, res) => {
  try {
    const data = await Menu.find({ userId: req.params.id });
    let totalCount = await Menu.countDocuments({ userId: req.params.id });

    d = menu;

let data1 = [data, d,{ total: totalCount, page:1, limit:20 }];
    res.json(data1);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET a single menu by ID
router.get("/menu/:id", async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST create a new menu
router.post("/", async (req, res) => {
  try {
    const { userId, title, link, type,submenus } = req.body;

    const newMenu = new Menu({
      userId,
      title,
      type,
      link,
      submenus, // Submenus are optional
    });

    console.log(submenus)
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE a menu
router.put("/:id", async (req, res) => {
  try {
    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.link) updateFields.link = req.body.link;
    if (req.body.type) updateFields.type = req.body.type;
    if (req.body.submenus) updateFields.submenus = req.body.submenus;

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) return res.status(404).json({ message: "Menu not found" });
    res.json(updatedMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE a menu
router.delete("/:id", async (req, res) => {
  try {
    const deletedMenu = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedMenu) return res.status(404).json({ message: "Menu not found" });
    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
