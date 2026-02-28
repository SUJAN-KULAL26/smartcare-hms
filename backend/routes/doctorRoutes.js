const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const auth = require("../middleware/auth");

// GET ALL DOCTORS
router.get("/", auth, async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// ADD DOCTOR
router.post("/", auth, async (req, res) => {
  try {
    const { name, specialization, experience, contact } = req.body;

    if (
      !name ||
      !specialization ||
      experience === undefined ||
      experience === null ||
      !contact
    ) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const newDoctor = new Doctor({
      name: name.trim(),
      specialization: specialization.trim(),
      experience: Number(experience),
      contact: contact.trim()
    });

    await newDoctor.save();
    res.json(newDoctor);

  } catch (error) {
  console.log("ADD DOCTOR ERROR:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: "Failed to add doctor" });
}
});

// UPDATE DOCTOR
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, specialization, experience, contact } = req.body;

    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        name,
        specialization,
        experience: Number(experience),
        contact
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.log("UPDATE DOCTOR ERROR:", error);
    res.status(500).json({ error: "Failed to update doctor" });
  }
});

// DELETE DOCTOR
router.delete("/:id", auth, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor Deleted Successfully" });
  } catch (error) {
    console.log("DELETE DOCTOR ERROR:", error);
    res.status(500).json({ error: "Failed to delete doctor" });
  }
});

module.exports = router;