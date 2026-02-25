const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// ✅ Add Patient
router.post("/add", async (req, res) => {
  console.log("📥 Add Patient Request:", req.body);

  try {
    const patient = new Patient(req.body);
    await patient.save();

    console.log("✅ Patient Saved");
    res.json({ message: "✅ Patient Added Successfully" });

  } catch (error) {
    console.log("❌ Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get Patients
router.get("/", async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

// ✅ Delete Patient
router.delete("/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "❌ Patient Deleted Successfully" });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Update Patient
router.put("/:id", async (req, res) => {
  console.log("✏️ Update Request:", req.body);

  try {
    await Patient.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "✏️ Patient Updated Successfully" });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;