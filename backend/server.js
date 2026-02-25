const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("🔥 SmartCare HMS Server Starting...");

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ✅ Routes
const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patients", patientRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("SmartCare HMS Backend Running");
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});