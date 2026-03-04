const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"]
  },
  contact: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: "Contact must be exactly 10 digits"
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);