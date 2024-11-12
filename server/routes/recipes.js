const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Recipe, validate } = require("../models/recipe");
const { User } = require("../models/user");
const upload = require("../config/multerConfig");

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = (await Recipe.find().sort("name")).map((recipe) => {
      const {
        _id,
        name,
        ingredients,
        directions,
        image,
        likeCount,
        cookingStepImages,
      } = recipe;
      return {
        _id,
        name,
        ingredients,
        directions,
        image,
        likeCount,
        cookingStepImages,
      };
    });
    res.send(recipes);
  } catch (ex) {
    res.status(500).send("Could not retrieve recipes.");
  }
});

// POST: Create a new recipe with main image and up to three cooking step images
router.post(
  "/",
  [
    auth,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "cookingStepImages", maxCount: 3 },
    ]),
  ],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Store paths of uploaded cooking step images in an array
    const cookingStepImages = req.files.cookingStepImages
      ? req.files.cookingStepImages.map((file) => `/uploads/${file.filename}`)
      : [];

    const recipe = new Recipe({
      name: req.body.name,
      image: req.files.image ? `/uploads/${req.files.image[0].filename}` : "",
      preparationTime: req.body.preparationTime,
      ingredients: req.body.ingredients,
      directions: req.body.directions,
      cookingStepImages: cookingStepImages,
      isFeatured: req.body.isFeatured,
      price: req.body.price || 0,
    });

    try {
      await recipe.save();
      res.send(recipe);
    } catch (ex) {
      res.status(500).send("Could not save recipe.");
    }
  }
);

// PUT: Update cooking step images for a recipe
router.put(
  "/:id/cookingStepImages",
  [auth, upload.array("cookingStepImages", 3)],
  async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).send("Recipe not found");

    // Replace cookingStepImages with new uploaded images
    recipe.cookingStepImages = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    try {
      await recipe.save();
      res.send(recipe);
    } catch (ex) {
      res.status(500).send("Could not update cooking step images.");
    }
  }
);

// PUT: Update a recipe by ID
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      preparationTime: req.body.preparationTime,
      ingredients: req.body.ingredients,
      directions: req.body.directions,
      cookingStepImages: req.body.cookingStepImages,
    },
    { new: true }
  );
  if (!recipe) return res.status(404).send("recipe not found");
  res.send(recipe);
});

// DELETE: Delete a recipe by ID
router.delete("/:id", [auth, admin], async (req, res) => {
  const recipe = await Recipe.findOneAndDelete(req.params.id);
  if (!recipe) return res.status(404).send("recipe not found");
  res.send(recipe);
});

// GET: Retrieve a recipe by ID
router.get("/:id", validateObjectId, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe)
    return res.status(404).send("The recipe with the given id was not found");
  res.send(recipe);
});

// POST: Like or unlike a recipe
router.post("/:id/like", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).send("Recipe not found");

    const userId = req.user._id;
    const userLikedIndex = recipe.likes.indexOf(userId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    if (userLikedIndex === -1) {
      // User hasn't liked, so add like
      recipe.likes.push(userId);
      recipe.likeCount += 1;
      user.likedRecipes.push(recipe._id);
    } else {
      // User has already liked, so unlike
      recipe.likes.splice(userLikedIndex, 1);
      recipe.likeCount -= 1;
      user.likedRecipes = user.likedRecipes.filter(
        (id) => id.toString() !== recipe._id.toString()
      );
    }

    await recipe.save();
    await user.save();

    res.send({ success: true, likeCount: recipe.likeCount });
  } catch (error) {
    res.status(500).send("Error processing like");
  }
});

module.exports = router;
