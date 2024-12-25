const mongoose = require("mongoose");
const date = new Date();
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    API_KEY: { type: String, default: "" },
    USER_ID: { type: String, default: "" },
    USER_PASSWORD: { type: String, default: "" },
    deadline: { type: Date, default: date },
    permission: { type: Boolean, default: false },
    phone: String,
    gender: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
