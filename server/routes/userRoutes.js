
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: "customer",
      customerType: "one-time",
      totalOrders: 0
    });

    await user.save();

    res.status(201).json({
      message: "Customer registered successfully",
      user
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Signup failed"
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      password
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      message: "Login successful",
      user
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed"
    });
  }
});

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
});

// GET CUSTOMERS ONLY
router.get("/customers", async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer"
    }).sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customers"
    });
  }
});

module.exports = router;

