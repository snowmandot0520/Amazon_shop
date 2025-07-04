const mongoose = require("mongoose");
const key = require("./keys");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(key.mongoURL, {
      useNewUrlParser: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
