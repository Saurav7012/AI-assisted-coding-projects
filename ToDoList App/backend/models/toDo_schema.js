const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"], 
      default: "pending"
    },
  },
  {
    timestamps: true // automatically adds createdAt and updatedAt
  }
);

const List = mongoose.model('List', todoSchema);
module.exports = List;
