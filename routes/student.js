const router = require("express").Router();
const verify = require("../verifyToken");
const Student = require("../models/Student");

//Update

router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const updateStudent = await Student.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateStudent);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can updat your own account");
  }
});
//delete

router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await Student.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can delete your own account");
  }
});
//get
router.get("/find/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const { password, ...info } = student._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all students
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin || req.user.isEmployee) {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to see all students!");
  }
});
//get user stats

module.exports = router;
