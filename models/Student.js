const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: Number },
    address: { type: String },
    qualification: { type: String },
    passOutYear: { type: String },
    skillSet: { type: String },
    employmentStatus: { type: String },
    technologyTraining: { type: String },
    year: { type: Number },
    course: { type: String },
    photo: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
    isEmployee: { type: Boolean, default: false },
    isStudent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
