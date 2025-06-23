const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  link: {
    type: String,
    
  },
  submenus: {
    type: Array,
    default: [], // Content is optional, defaults to an empty array
  },
});

exports.Menu = mongoose.model("Menu", menuSchema);

