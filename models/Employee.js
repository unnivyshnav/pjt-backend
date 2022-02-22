const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    photo: { type: String, defaut: "" },
    isAdmin: { type: Boolean, default: false },
    isEmployee: { type: Boolean, default: true },
    isStudent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
