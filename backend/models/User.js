const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Admin", "Doctor", "Staff"] }
});

module.exports = mongoose.model("User", userSchema);