const express = require("express");
const Userroutes = express.Router();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_USER_SECRET;

const { usermodel, purchasemodel, coursemodel } = require("../db.js");
const { z } = require("zod");
const bcrypt = require("bcrypt");

const userauthmiddleware = require("../middlewares/user.js");

Userroutes.post("/signup", async (req, res) => {
    try {
        // Input validation schema
        const reqschema = z.object({
            email: z.string().email(),
            password: z
                .string()
                .min(5)
                .max(50)
                .regex(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])/,
                    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
                ),
        });

        const { email, password } = req.body;

        reqschema.parse({ email, password });

        // ✅ Check if user already exists
        const existingUser = await usermodel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // ✅ If not, create the user
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await usermodel.create({
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        console.error(error);

        let errorMessage = "Invalid request parameters";

        // zod validation error
        if (error.errors && Array.isArray(error.errors)) {
            errorMessage = error.errors[0].message;
        }

        res.status(400).json({ message: errorMessage });
    }
});
Userroutes.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await usermodel.findOne({ email });

    if (!response) {
      return res.status(400).json({ message: "User not found" }); // ✅ use message
    }

    const result = await bcrypt.compare(password, response.password);
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
