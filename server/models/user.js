const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    unique: true,
    minLength: 5,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024,
  },
  isAdmin: Boolean,
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  myRecepies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  avatar: { type: String }, // URL or path to the profile image
  firstName: { type: String, maxLength: 50 },
  lastName: { type: String, maxLength: 50 },
  country: { type: String, maxLength: 50 },
  province: { type: String, maxLength: 50 },
  city: { type: String, maxLength: 50 },
  description: { type: String, maxLength: 500 },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    firstName: Joi.string().max(50),
    lastName: Joi.string().max(50),
    country: Joi.string().max(50),
    province: Joi.string().max(50),
    city: Joi.string().max(50),
    description: Joi.string().max(500),
    avatar: Joi.string().uri(),
    likedRecipes: Joi.array().items(Joi.objectId()),
    myRecepies: Joi.array().items(Joi.objectId()),
    savedRecipes: Joi.array().items(Joi.objectId()),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
