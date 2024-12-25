const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middleware/auth");
const User = require("../models/User");
const dotenv = require("dotenv");
const Payment = require("../models/Payment");
const NgData = require("../models/NgData");
const AddPrice = require("../models/AddPrice");
const TransFee = require("../models/TransFee");
const SubQuantity = require("../models/SubQuantity");
dotenv.config();

// @ route    GET api/auth
// @desc      Get logged in user
// @ access   Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    checkPermission(user);
    const payment = await Payment.find({ _id: user._id }).populate("");
    console.log(checkPermission(user));
    if (!user) {
      return res.status(400).json({ msg: "user doesn't exist" });
    }
    res.json({ user, payment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("");
  }
});
const checkPermission = (user) => {
  const today = new Date();
  console.log(today.getDate(), today.getMonth() + 1, user.deadline.getDate());
  const deadDay = user.deadline.getDate();
  const deadMonth = user.deadline.getMonth();
  const cuDay = today.getDate();
  const cuMonth = today.getMonth();

  if (cuMonth > deadMonth) {
    return false;
  } else {
    if (cuMonth == deadMonth && cuDay > deadDay) {
      return false;
    }
    if (user.permission) return true;
    else return false;
  }
};

router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const today = Date();
    if (!users) {
      return res.status(400).json({ msg: "user doesn't exist" });
    }
    res.json({ users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("");
  }
});

router.post(
  "/register",
  body("username", "ユーザー名を入力してください").not().isEmpty(),
  body("email", "有効な電子メールを含めてください").isEmail(),
  body("password", "パスワードは6文字未満にしてください").isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const { firstname, lastname, username, email, password } = req.body;
    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      console.log(user);
      if (user) {
        return res.status(400).send("このユーザーは既に存在します");
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
      console.log(result);
      const payment = new Payment({
        _id: result._id,
      });
      const data = await payment.save();

      const transfee = new TransFee({
        _id: result._id,
      });
      await transfee.save();
      const subQuantity = new SubQuantity({
        _id: result._id,
        subquantity: 10,
      });
      await subQuantity.save();
      const ngdata = new NgData({
        _id: result._id,
      });
      await ngdata.save();
      console.log(data);
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
router.post(
  "/",
  body("email", "有効な電子メールを含めてください").isEmail(),
  body("password", "パスワードが必要です").exists(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.errors[0].msg });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(400).json({ msg: "電子メールが無効です" });
      }
      // if (!checkPermission(user)) {
      //   return res.status(400).json({ msg: "使用期間が切れました。" });
      // }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "パスワードが無効です" });
      }

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
        async (error, token) => {
          if (error) throw error;
          const { password, ...others } = user._doc;
          // console.log('payment',user,paymentStatus);
          res.json({
            token,
            user: { ...others },
          });
        }
      );
    } catch (err) {
      // console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  console.log(req.body);
  const { password, currentPassword, ...others } = req.body;
  const user = await User.findById(req.user.id);
  let newPassword;
  if (password) {
    let salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(req.body.password, salt);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old password isn't correct" });
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        ...others,
        password: newPassword,
      },
    },
    // To ensure it returns the updated User
    { new: true }
  );
  res.status(200).json(updatedUser);
});
router.put("/qoo10/:id", verifyTokenAndAuthorization, async (req, res) => {
  console.log(req.body);
  const { _id, ...others } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      $set: {
        ...others,
      },
    },
    // To ensure it returns the updated User
    { new: true }
  );
  console.log(updatedUser);
  res.status(200).json(updatedUser);
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({ msg: "user doesn't exist" });
    }
    res
      .status(200)
      .json({ msg: "User is successfully deleted", _id: req.params.id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "user doesn't exist" });
    }
    // console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
