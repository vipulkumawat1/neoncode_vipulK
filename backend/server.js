const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/review");
const recommendationRoutes = require("./routes/recommendations");

const app = express();

const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NEONCODE backend is running",
  });
});

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `NEONCODE backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  }
}

startServer();