const express = require("express");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const { Recipe } = require("../models/recipe");

const router = express.Router();

// GET: Fetch Dashboard Summary
router.get("/summary", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "coins avatar firstName name"
    );
    if (!user) return res.status(404).send("User not found");

    const summary = {
      coins: user.coins,
      avatar: user.avatar,
      name: user.firstName || user.name,
    };

    res.send(summary);
  } catch (error) {
    console.error(error); // Log the full error
    res.status(500).send("Server error");
  }
});

// PUT: Add Coins to User
router.put("/add-coins", auth, async (req, res) => {
  const { coins } = req.body;

  if (typeof coins !== "number" || coins <= 0) {
    return res.status(400).send("Invalid coin amount");
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { coins: coins } },
      { new: true }
    );

    res.send({ success: true, coins: user.coins });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET: Fetch User's Own Recipes
router.get("/my-recipes", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "myRecipes",
      select: "name image cookingStepImages price isFeatured",
    });
    res.send(user.myRecipes);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET: Fetch Saved Recipes
router.get("/saved-recipes", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedRecipes",
      select: "name image cookingStepImages",
    });
    res.send(user.savedRecipes);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET: Fetch Liked Recipes
router.get("/liked-recipes", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "likedRecipes",
      select: "name image cookingStepImages",
    });
    res.send(user.likedRecipes);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET: Fetch Bought Recipes
router.get("/bought-recipes", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "boughtRecipes",
      select: "name image cookingStepImages",
    });
    res.send(user.boughtRecipes);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
