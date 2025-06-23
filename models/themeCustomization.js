const mongoose = require("mongoose");

const themeCustomizationSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // Each page must belong to a user
    },
  content: {
    type: Array,
    default: [], // Content is optional, defaults to an empty array
  },
  createdAt: { type: Date, default: Date.now }
});

exports.ThemeCustomization = mongoose.model("ThemeCustomization", themeCustomizationSchema);
