const auth = require("../middleware/auth"); // Authorization middleware
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const { Recipe } = require("../models/recipe");
const router = express.Router();
const upload = require("../config/multerConfig");

// GET current user data (without password)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// POST: Register a new user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.send({ token: token });
});

// PUT: Update user profile data (newly added route)
router.put("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    // Update user fields from the request body
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.country = req.body.country || user.country;
    user.province = req.body.province || user.province;
    user.city = req.body.city || user.city;
    user.description = req.body.description || user.description;

    await user.save();
    res.send({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// POST: Save or unsave a recipe for the user
router.post("/save-recipe", auth, async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const recipe = await Recipe.findById(recipeId);
    const index = user.savedRecipes.indexOf(recipeId);

    if (index > -1) {
      user.savedRecipes.splice(index, 1);
      recipe.savedBy = recipe.savedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      user.savedRecipes.push(recipeId);
      recipe.savedBy.push(userId);
    }

    await user.save();
    await recipe.save();
    res.json({
      success: true,
      savedRecipes: user.savedRecipes,
      savedByCount: recipe.savedBy.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT: Upload or update avatar
router.put("/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    // Update avatar if a new file is uploaded
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`; // Store relative path to image
      await user.save();
      res.send({ success: true, message: "Avatar updated successfully", user });
    } else {
      res.status(400).send("No file uploaded");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// DELETE: Delete avatar
router.delete("/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    user.avatar = null; // Remove avatar path
    await user.save();
    res.send({ success: true, message: "Avatar deleted successfully" });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET: Retrieve user's saved recipes
router.get("/saved-recipes", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedRecipes");
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Retrieve user's liked recipes
router.get("/liked-recipes", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("likedRecipes");
    res.json({ likedRecipes: user.likedRecipes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
