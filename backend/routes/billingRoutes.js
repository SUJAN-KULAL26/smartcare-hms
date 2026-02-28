const express = require("express");
const router = express.Router();
const Billing = require("../models/Billing");
const Appointment = require("../models/Appointment");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

/*
=====================================
GET ALL BILLS
=====================================
*/
router.get("/", auth, async (req, res) => {
  try {
    const bills = await Billing.find()
      .populate("patient", "name")
      .populate("doctor", "name")
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (err) {
    console.error("GET BILLS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
=====================================
CREATE BILL
=====================================
*/
router.post("/", auth, async (req, res) => {
  try {
    const { appointmentId, consultationFee, extraCharges, paymentMethod } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ error: "Appointment ID missing" });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient")
      .populate("doctor");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const newBill = new Billing({
      appointment: appointment._id,
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      consultationFee: Number(consultationFee),
      extraCharges: Number(extraCharges || 0),
      paymentMethod,
      paymentStatus: "Paid"
    });

    await newBill.save();

    res.json(newBill);

  } catch (err) {
    console.error("CREATE BILL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/*
=====================================
SUMMARY REPORT
=====================================
*/
router.get("/report/summary", auth, role(["Admin"]), async (req, res) => {
  try {

    // Total Revenue
    const totalRevenueData = await Billing.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // Today Revenue (based on paymentDate if paid)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRevenueData = await Billing.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          paymentDate: { $gte: today }
        }
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // Unpaid
    const unpaidData = await Billing.aggregate([
      { $match: { paymentStatus: "Unpaid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.json({
      totalRevenue: totalRevenueData[0]?.total || 0,
      todayRevenue: todayRevenueData[0]?.total || 0,
      unpaidAmount: unpaidData[0]?.total || 0
    });

  } catch (err) {
    console.error("Revenue Report Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/*
=====================================
MONTHLY REPORT
=====================================
*/
router.get("/report/monthly", auth, role(["Admin"]), async (req, res) => {
  try {

    const result = await Billing.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(result);

  } catch (err) {
    console.error("Monthly Report Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/*
=====================================
DOCTOR-WISE REPORT (FIXED CLEAN VERSION)
=====================================
*/
router.get("/report/doctor-wise", auth, role(["Admin"]), async (req, res) => {
  try {

    const result = await Billing.aggregate([
      {
        $group: {
          _id: "$doctor",
          total: { $sum: "$totalAmount" }
        }
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctorData"
        }
      },
      { $unwind: "$doctorData" },
      {
        $project: {
          _id: 0,
          doctorName: "$doctorData.name",
          total: 1
        }
      }
    ]);

    res.json(result);

  } catch (err) {
    console.error("Doctor Wise Report Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;