const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/yummycart")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.json({ message: "User Registered Successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ message: "Login Successful ✅" });
    } else {
      res.status(400).json({ message: "Invalid Credentials ❌" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});

//  ORDER SCHEMA 
const orderSchema = new mongoose.Schema({
  items: Array,
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);