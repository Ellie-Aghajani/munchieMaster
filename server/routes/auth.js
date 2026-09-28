const config = require("config");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose"); //node_8.mongo data validation_7.mp4
const express = require("express");
const router = express.Router();

// const complexityOptions = {
//     min: 8,
//     max: 26,
//     lowerCase: 1,
//     upperCase: 1,
//     numeric: 1,
//     symbol: 1,
//     requirementCount: 4,
// };

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string")
    return res.status(400).send("Invalid email or password.");

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // Accounts from before email verification have no value and count as verified
  if (user.emailVerified === false)
    return res.status(403).send({ code: "EMAIL_NOT_VERIFIED", email: user.email });

  const token = user.generateAuthToken();

  res.send({ token: token });
});

// function validate(req) {
//     const schema = Joi.object({

//         email: Joi.string().min(5).max(255).required(),
//         password: passwordComplexity(complexityOptions).required()

//     });
//     return schema.validate(req);
// }

module.exports = router;
