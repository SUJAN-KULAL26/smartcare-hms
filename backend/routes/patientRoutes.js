const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const auth = require("../middleware/auth");

// ================= GET ALL =================
router.get("/", auth, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CREATE =================
router.post("/", auth, async (req, res) => {
  try {
    const { name, age, gender, contact } = req.body;

    if (!name || !age || !gender || !contact) {
      return res.status(400).json({ error: "All fields required" });
    }

    const newPatient = new Patient({
      name,
      age,
      gender,
      contact
    });

    await newPatient.save();
    res.json(newPatient);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE =================
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE =================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;