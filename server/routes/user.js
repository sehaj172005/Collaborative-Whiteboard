const express = require("express");
const Userroutes = express.Router();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_USER_SECRET;

const { usermodel, purchasemodel, coursemodel } = require("../db.js");
const { z } = require("zod");

const userauthmiddleware = require("../middlewares/user.js");

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

Userroutes.post("/signup", async (req, res) => {
  try {
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0]?.message || "Invalid input";
      return res.status(400).json({ message: errorMessage });
    }

    const { email, password } = parsedData.data;

    // Check if user already exists
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create the user
    const user = await usermodel.create({ email, password });

    res.status(201).json({ message: "User created successfully", user });

  } catch (error) {
    console.error("Signup error", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});
Userroutes.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await usermodel.findOne({ email });

    if (!response) {
      return res.status(400).json({ message: "User not found" }); // ✅ use message
    }

    const result = (password === response.password);
    const id = response.id;

    if (result) {
      const token = jwt.sign({ id }, JWT_SECRET);
      // You can include name/email if needed to show in frontend
      return res.json({ token, name: response.name || email.split("@")[0] });
    } else {
      return res.status(401).json({ message: "Invalid password" }); // ✅ use message
    }
  } catch (error) {
    console.error("Signin error", error);
    return res.status(500).json({ message: "Internal server error" }); // ✅ use message
  }
});


module.exports = Userroutes;  // ✅ FIX: Export router properly
