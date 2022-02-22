const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    fee: { type: Number },
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
