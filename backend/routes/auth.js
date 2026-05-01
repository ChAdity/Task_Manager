import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashed
    });

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json("Register error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("User not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json("Invalid password");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secret"
    );

    res.json({
      token,
      role: user.role  
    });

  } catch (err) {
    console.log(err);
    res.status(500).json("Login error");
  }
});

export default router;