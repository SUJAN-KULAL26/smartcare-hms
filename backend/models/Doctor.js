const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  contact: {
  type: String,
  required: true,
  validate: {
    validator: function(v) {
      return /^\d{8,15}$/.test(v);
    },
    message: "Contact must be between 8 and 15 digits"
  }
}
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);