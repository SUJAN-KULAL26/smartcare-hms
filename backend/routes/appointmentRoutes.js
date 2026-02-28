const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const auth = require("../middleware/auth");

// ================= GET ALL APPOINTMENTS =================
router.get("/", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name")
      .populate("doctor", "name specialization");

    res.json(appointments);
  } catch (err) {
    console.log("GET Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= CREATE APPOINTMENT =================
router.post("/", auth, async (req, res) => {
  try {
    const { patient, doctor, date } = req.body;

    if (!patient || !doctor || !date) {
      return res.status(400).json({ error: "All fields required" });
    }

    const newAppointment = new Appointment({
      patient,
      doctor,
      date
    });

    await newAppointment.save();
    res.json(newAppointment);

  } catch (err) {
    console.log("Appointment POST Error:", err);
    res.status(500).json({ error: err.message });
  }
});
// ================= UPDATE APPOINTMENT =================
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("patient doctor");

    res.json(updated);
  } catch (err) {
    console.log("PUT Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE APPOINTMENT =================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment Deleted Successfully" });
  } catch (err) {
    console.log("DELETE Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;