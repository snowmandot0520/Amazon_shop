const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyTokenAndAdmin } = require("../middleware/auth");
const dotenv = require("dotenv");
const Payment = require("../models/Payment");
const NgData = require("../models/NgData");
dotenv.config({ path: "../config/config.env" });

// @ route GET api/user
// @ desc  Get registered user
// @ access Private
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    console.log("user", user);
    res.status(200).json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "user doesn't exist" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  console.log(query);
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);
    res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/register",
  body("username", "Please enter a username").not().isEmpty(),
  body("email", "Please include a valid email").isEmail(),
  body(
    "password",
    "Please password shouldnt be less than 6 characters"
  ).isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const { firstname, lastname, username, email, password } = req.body;
    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).send("User already exists");
      }

      // CREATE A NEW USER
      user = new User({
        username,
        email,
        password,
      });

      let salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      const result = await user.save();
      const payment = new Payment({
        _id: result._id,
      });
      const data = await payment.save();
      console.log(data);
      const newngcollection = new NgData({
        _id: result._id,
      });
      console.log(newngcollection);
      const payload = {
        user: {
          id: user.id,
          // only an admin can take CRUD operations to collections & delete any users
          // if not an admin, the user can only make CRUD operations to his/her account
          isAdmin: user.isAdmin,
        },
      };
      jwt.sign(
        payload,
        process.env.JWTSECRET,
        {
          expiresIn: 360000,
        },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (err) {
      // console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
