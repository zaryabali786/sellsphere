const express = require("express");
const router = express.Router();
const Visit = require("../models/userVisitor");

// ✅ API to Get Total Visits (All-Time)
router.get("/total-visits", async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments(); // Count all records
    res.json({ totalVisits });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch total visits" });
  }
});


// ✅ Get unread visitors with pagination
router.get("/unread-visitors", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalUnread = await Visit.countDocuments({ isRead: false });
    const unreadVisitors = await Visit.find({ isRead: false })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ visitedAt: -1 });

    res.json({ totalUnread, visitors: unreadVisitors });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unread visitors" });
  }
});


router.put("/mark-as-read/:id", async (req, res) => {
  try {
    const visitor = await Visit.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }
    
    res.json({ message: "Visitor marked as read", visitor });
  } catch (error) {
    res.status(500).json({ error: "Failed to update visitor status" });
  }
});


router.put("/mark-all-as-read", async (req, res) => {
  try {
    await Visit.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: "All visitors marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update visitors" });
  }
});


router.delete("/delete-all-visitors", async (req, res) => {
  try {
    await Visit.deleteMany({});
    res.json({ message: "All visitors deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete visitors" });
  }
});


router.delete("/delete-visitor/:id", async (req, res) => {
  try {
    const deletedVisitor = await Visit.findByIdAndDelete(req.params.id);
    if (!deletedVisitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }
    res.json({ message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete visitor" });
  }
});


// ✅ API to Get Visits by Month
router.get("/visits-by-month", async (req, res) => {
  try {
    const { month, year } = req.query; // Example: ?month=02&year=2025

    if (!month || !year) {
      return res.status(400).json({ error: "Month and Year are required" });
    }

    const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-${month}-31T23:59:59.999Z`);

    const monthlyVisits = await Visit.countDocuments({
      visitedAt: { $gte: startDate, $lte: endDate },
    });

    res.json({ month, year, totalVisits: monthlyVisits });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch monthly visits" });
  }
});

router.get("/unread-count", async (req, res) => {
  try {
    const unreadCount = await Visit.countDocuments({ isRead: false });
    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});


module.exports = router;
