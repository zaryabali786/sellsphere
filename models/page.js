const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true, // Each page must belong to a user
  },
  route: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: Array,
    default: [], // Content is optional, defaults to an empty array
  },
});


exports.Page = mongoose.model("Page", pageSchema);
