// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// ✅ Schemas
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: String,
  clothesType: String,
  password: { type: String, required: true }
}, { timestamps: true });

const ngoSchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: String,
  password: { type: String, required: true }
}, { timestamps: true });

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  email: { type: String, required: true },
  pickupAddress: { type: String, required: true },
  clothesType: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickupDate: { type: String, required: true },
  pickupTime: { type: String, required: true },
  status: { type: String, default: "Pending" }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: String,
  location: String,
  imageUrl: String
}, { timestamps: true });

// ✅ Models
const Donor = mongoose.model("Donor", donorSchema);
const NGO = mongoose.model("NGO", ngoSchema);
const Donation = mongoose.model("Donation", donationSchema);
const Event = mongoose.model("Event", eventSchema);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🌍 Cloth Donation Backend API is running...");
});


// ---------------------------------------------
// 🧩 AUTHENTICATION ROUTES
// ---------------------------------------------

// Donor Registration
app.post("/api/register/donor", async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.json({ message: "Donor registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NGO Registration
app.post("/api/register/ngo", async (req, res) => {
  try {
    const ngo = new NGO(req.body);
    await ngo.save();
    res.json({ message: "NGO registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Universal Login Route (Donor + NGO)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check Donor
    const donor = await Donor.findOne({ email, password });
    if (donor) {
      return res.json({ message: "Login successful", userType: "donor" });
    }

    // Check NGO (Admin)
    const ngo = await NGO.findOne({ email, password });
    if (ngo) {
      return res.json({ message: "Login successful", userType: "ngo" });
    }

    res.status(401).json({ error: "Invalid credentials!" });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});


// ---------------------------------------------
// 🎁 DONATION ROUTES
// ---------------------------------------------
app.post("/api/donations", async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.json({ message: "Donation scheduled successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------------------------------------
// 🎉 EVENT ROUTES (CRUD for NGO/Admin)
// ---------------------------------------------

// ➕ Add New Event
app.post("/api/events", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json({ message: "Event added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📜 Get All Events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Event
app.put("/api/events/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete Event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------------------------------------
// 🚀 Start Server
// ---------------------------------------------
const PORT = process.env.PORT || 5000;
// ✅ Route: Get Single Event by ID (for editing)
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("❌ Error fetching event:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
