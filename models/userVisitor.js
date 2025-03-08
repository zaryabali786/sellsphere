const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  ip: { type: String },
  country: { type: String },
  city: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  visitedAt: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 }, // Duration in minutes
  isRead: { type: Boolean, default: false },
});

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;

