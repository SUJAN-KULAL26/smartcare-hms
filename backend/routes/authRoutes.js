const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Basic validation
    if (!username || !password || !role) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    if (password.length <= 6) {
      return res.status(400).json({
        error: "Password must be more than 6 characters"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        error: "Username already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({
      message: "User Registered Successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: "Server error"
    });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({
      error: "Server error"
    });
  }
});

module.exports = router;