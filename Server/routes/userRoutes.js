const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


router.post("/SignUp", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(422).send({ Error: "Please enter all the fields" });
    }
    alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return res.status(400).send({ Error: "Email already exist " });
    }

    hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });
    await user.save();
    res.send({ Message: "Saved Successfully!!" });
    res.send({ user });
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ Error: "Enter both email and password " });
    }
    const savedUser = await User.findOne({ email });

    if (!savedUser) {
      return res.status(400).send({ Error: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, savedUser.password);

    if (!isMatch) res.send({ Error: " Username and password donot match" });

    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
    const { _id, name } = savedUser;
    res.send({
      Message: "Signed in Successfully. Token generated",
      token,
      user: { _id, name, email },
    });
  } catch (err) {
    res.status(401).send("Error Occured");
  }
});
module.exports = router;
