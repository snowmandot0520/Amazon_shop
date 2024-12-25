const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();
app.use(
  cors({
    origin: [
      "https://os3-389-27638.vs.sakura.ne.jp:5173",
      "http://os3-389-27638.vs.sakura.ne.jp:5173",
      "https://localhost:5173",
      "http://localhost:5173",
      "https://148.251.126.212:5173",
      "http://148.251.126.212:5173",
      "http://localhost:4000",
      "https://amazon-shopee-delta.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/create-subscription", require("./routes/stripe"));
app.use("/api/products", require("./routes/getAmazonProduct"));
app.use("/api/ngdata", require("./routes/ngData"));
app.use("/api/qoo10", require("./routes/qoo10"));
app.use("/api/exhibit", require("./routes/exhibit"));

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "client/build")));

  // Route all other requests to the React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
