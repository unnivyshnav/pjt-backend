const router = require("express").Router();
const verify = require("../verifyToken");
const Student = require("../models/Student");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// gmail access
const CLIENT_ID =
  "224122484492-4bstbv782g6rqq8ct464esbjkq8bbiqn.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04sF-IaK5aN5NCgYIARAAGAQSNwF-L9IrEon2MpnK7ZLvZH8UdEKBgfWMDmhZMsBfR76DFO8FZjTFBufEj4q5zejOYZu8EdtptbY";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

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

//get all students
router.get("/all", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a student
router.get("/find/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const { password, ...info } = student._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get approved students
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin || req.user.isEmployee) {
    try {
      const students = await Student.find({ isApproved: true });
      res.status(200).json(students);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to see all students!");
  }
});

//get students pending approvel
router.get("/approve", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const students = await Student.find({ isApproved: false });
      res.status(200).json(students);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to see the students");
  }
});

// approve student
router.put("/approve/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updateStudent = await Student.findByIdAndUpdate(
        req.params.id,
        {
          isApproved: true,
        },
        { new: true }
      );
      const student = await Student.findById(req.params.id);
      res.status(200).json(updateStudent);
      const mailid = student.email;
      const message = "hi";
      const sub = "hi";
      console.log(mailid);
      async function sendMail() {
        try {
          const accessToken = await oAuth2Client.getAccessToken();

          const transport = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
              type: "OAuth2",
              user: "ictak.enrollment@gmail.com",
              clientId: CLIENT_ID,
              clientSecret: CLEINT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken,
            },
            tls: { rejectUnauthorized: false },
          });

          const mailOptions = {
            from: "ICTAK <ictak.enrollment@gmail.com>",
            to: mailid,
            subject: sub,
            text: message,
            // html: '<h3>{message}</h3>',
          };

          const result = await transport.sendMail(mailOptions);
          return result;
        } catch (error) {
          return error;
        }
      }

      sendMail();
      // .then((result) => res.json("response Mail Sent Succesfully"))
      // .catch((error) => res.json("response Heading Something Went Wrong"));
    } catch (err) {
      //   res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can updat your own account");
  }
});
module.exports = router;
