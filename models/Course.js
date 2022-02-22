const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    photo: { type: String, defaut: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
