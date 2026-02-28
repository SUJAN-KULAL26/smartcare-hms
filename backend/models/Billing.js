const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({

  invoiceNumber: {
    type: String,
    unique: true
  },

  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true
  },

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },

  extraCharges: {
    type: Number,
    default: 0,
    min: 0
  },

  totalAmount: {
    type: Number,
    min: 0
  },

  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid"
  },

  paymentMethod: {
    type: String,
    enum: ["Cash", "UPI", "Card"],
    default: "Cash"
  },

  paymentDate: {
    type: Date
  }

}, { timestamps: true });


/* 🔥 AUTO CALCULATE TOTAL */
/* 🔥 AUTO CALCULATE TOTAL */
billingSchema.pre("save", async function () {

  // Auto-calculate total
  this.totalAmount =
    Number(this.consultationFee) + Number(this.extraCharges || 0);

  // Auto-generate invoice number if not exists
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Billing").countDocuments();
    this.invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
  }

  // Auto-set payment date if paid
  if (this.paymentStatus === "Paid" && !this.paymentDate) {
    this.paymentDate = new Date();
  }

});

module.exports = mongoose.model("Billing", billingSchema);