const express = require("express");
const {Page} = require("../models/page");
const router = express.Router();
const { pages } = require('../constant/constant');


// ✅ GET all pages for a specific user
router.get("/:id", async (req, res) => {
  try {
    console.log(req.params.id,"solve")
    const data = await Page.find({ userId: req.params.id });
    let totalCount = await Page.countDocuments({ userId: req.params.id });

    d = pages;

let data1 = [data, d,{ total: totalCount, page:1, limit:20 }];
    res.json(data1);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET a specific page by userId & route
router.get("/:userId/:route", async (req, res) => {
  try {
    const page = await Page.findOne({ 
      userId: req.params.userId, 
      route: req.params.route 
    });

    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST a new page (userId required)
router.post("/", async (req, res) => {
  try {
    const { userId, route, title, description, content = [] } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newPage = new Page({ userId, route, title, description, content });
    await newPage.save();
    res.status(201).json(newPage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE a page by userId & route (only update provided fields)
router.put("/:pageId", async (req, res) => {
  try {
    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.content) updateFields.content = req.body.content;
    if (req.body.route) updateFields.route = req.body.route; // Update route if changed

    const updatedPage = await Page.findByIdAndUpdate(
      req.params.pageId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(updatedPage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE a page by userId & route
router.delete("/:pageId", async (req, res) => {
  try {
    const deletedPage = await Page.findByIdAndDelete(req.params.pageId);

    if (!deletedPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({ message: "Page deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
