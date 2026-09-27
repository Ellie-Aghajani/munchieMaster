const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Recipe, validate } = require("../models/recipe");
const { User } = require("../models/user");
const upload = require("../config/multerConfig");
const optionalAuth = require("../middleware/optionalAuth");
const { removeUpload } = require("../utils/uploads");
const {
  COINS,
  RECIPE_SUMMARY_FIELDS,
  authorIdOf,
  authorNameOf,
  canViewRecipe,
  rewardAuthor,
} = require("../utils/coins");

const AUTHOR_FIELDS = "name firstName";

// Remove fields that only the server needs
const toPublicRecipe = (recipe) => {
  const data = recipe.toObject();
  delete data.likes;
  delete data.savedBy;
  delete data.likeRewardedBy;
  delete data.saveRewardedBy;
  return data;
};

// Authors manage their own recipes; admins manage all of them
const canManageRecipe = (recipe, user) => {
  const authorId = authorIdOf(recipe);
  return !!user.isAdmin || (!!authorId && authorId.equals(user._id));
};

// GET all recipes (summary fields for cards)
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .select(RECIPE_SUMMARY_FIELDS)
      .populate("author", AUTHOR_FIELDS)
      .sort("name");
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

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    // Recipes from admins are free; recipes from other users cost coins to unlock
    const isPaid = !user.isAdmin;
    const recipe = new Recipe({
      name: req.body.name,
      image: req.files.image ? `/uploads/${req.files.image[0].filename}` : "",
      preparationTime: req.body.preparationTime,
      ingredients: req.body.ingredients,
      directions: req.body.directions,
      cookingStepImages: cookingStepImages,
      author: user._id,
      isFeatured: isPaid,
      price: isPaid ? COINS.RECIPE_PRICE : 0,
    });

    try {
      await recipe.save();
      user.myRecipes.push(recipe._id);
      user.coins += COINS.POST_REWARD;
      await user.save();
      res.send({
        recipe: toPublicRecipe(recipe),
        coinsEarned: COINS.POST_REWARD,
        coins: user.coins,
      });
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
    if (!canManageRecipe(recipe, req.user)) {
      req.files.forEach((file) => removeUpload(`/uploads/${file.filename}`));
      return res.status(403).send("You can only edit your own recipes.");
    }

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

// PUT: Update a recipe; only its author or an admin. Price, author and coins don't change.
router.put(
  "/:id",
  [validateObjectId, auth, upload.fields([{ name: "image", maxCount: 1 }])],
  async (req, res) => {
    const newImage = req.files?.image?.[0];
    // Multer saves the upload before we can check access, so drop it on failure
    const reject = (status, message) => {
      if (newImage) removeUpload(`/uploads/${newImage.filename}`);
      return res.status(status).send(message);
    };

    const { error } = validate(req.body);
    if (error) return reject(400, error.details[0].message);

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return reject(404, "recipe not found");
    if (!canManageRecipe(recipe, req.user))
      return reject(403, "You can only edit your own recipes.");

    const oldImage = recipe.image;
    recipe.name = req.body.name;
    recipe.preparationTime = req.body.preparationTime;
    recipe.ingredients = req.body.ingredients;
    recipe.directions = req.body.directions;
    if (newImage) recipe.image = `/uploads/${newImage.filename}`;

    try {
      await recipe.save();
    } catch (ex) {
      return reject(500, "Could not update the recipe.");
    }
    if (newImage && oldImage) removeUpload(oldImage);
    await recipe.populate("author", AUTHOR_FIELDS);
    res.send({ recipe: toPublicRecipe(recipe) });
  }
);

// Coins taken from the author when a recipe is deleted: the posting reward back,
// plus a refund of the price to everyone who unlocked it
const deletionCost = (recipe, buyerCount) =>
  (authorIdOf(recipe) ? COINS.POST_REWARD : 0) + recipe.price * buyerCount;

// DELETE: Authors delete their own recipes; admins can delete any recipe
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).send("recipe not found");

    const authorId = authorIdOf(recipe);
    const isAuthor = !!authorId && authorId.equals(req.user._id);
    if (!isAuthor && !req.user.isAdmin)
      return res.status(403).send("You can only delete your own recipes.");

    const buyers = recipe.price
      ? await User.find({ boughtRecipes: recipe._id }).select("_id")
      : [];
    const cost = deletionCost(recipe, buyers.length);

    let authorCoins;
    if (authorId && cost > 0) {
      if (isAuthor) {
        // Conditional update so the balance can't go negative
        const author = await User.findOneAndUpdate(
          { _id: authorId, coins: { $gte: cost } },
          { $inc: { coins: -cost } },
          { new: true }
        );
        if (!author) {
          const refundText =
            buyers.length === 1
              ? ` plus ${recipe.price} coins back to the member who unlocked it`
              : buyers.length > 1
              ? ` plus ${recipe.price} coins back to each of the ${buyers.length} members who unlocked it`
              : "";
          return res
            .status(400)
            .send(
              `Deleting this recipe costs ${cost} coins: the ${COINS.POST_REWARD} coins you earned for posting it${refundText}.`
            );
        }
        authorCoins = author.coins;
      } else {
        // Admin moderation always succeeds; the author's balance stops at 0
        await User.updateOne({ _id: authorId }, [
          { $set: { coins: { $max: [0, { $subtract: ["$coins", cost] }] } } },
        ]);
      }
    }

    await recipe.deleteOne();

    if (buyers.length) {
      await User.updateMany(
        { _id: { $in: buyers.map((buyer) => buyer._id) } },
        {
          $inc: {
            coins: recipe.price,
            "unseenEarnings.coins": recipe.price,
            "unseenEarnings.refunds": 1,
          },
        }
      );
    }

    // Remove the recipe from every user's lists
    await User.updateMany(
      {
        $or: [
          { savedRecipes: recipe._id },
          { likedRecipes: recipe._id },
          { myRecipes: recipe._id },
          { boughtRecipes: recipe._id },
        ],
      },
      {
        $pull: {
          savedRecipes: recipe._id,
          likedRecipes: recipe._id,
          myRecipes: recipe._id,
          boughtRecipes: recipe._id,
        },
      }
    );

    [recipe.image, ...recipe.cookingStepImages].forEach(removeUpload);

    res.send({
      success: true,
      coinsDeducted: authorId ? cost : 0,
      refundedBuyers: buyers.length,
      coins: authorCoins,
    });
  } catch (error) {
    res.status(500).send("Could not delete the recipe.");
  }
});

// GET: Retrieve a recipe by ID; paid recipes are summary-only until unlocked
router.get("/:id", [validateObjectId, optionalAuth], async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate(
    "author",
    AUTHOR_FIELDS
  );
  if (!recipe)
    return res.status(404).send("The recipe with the given id was not found");

  const viewer = req.user
    ? await User.findById(req.user._id).select("boughtRecipes")
    : null;
  const data = toPublicRecipe(recipe);

  // Authors and admins see what deleting would cost
  const authorId = authorIdOf(recipe);
  if (
    req.user &&
    (req.user.isAdmin || (authorId && authorId.equals(req.user._id)))
  ) {
    const buyerCount = recipe.price
      ? await User.countDocuments({ boughtRecipes: recipe._id })
      : 0;
    data.buyerCount = buyerCount;
    data.deletionCost = deletionCost(recipe, buyerCount);
  }

  if (!canViewRecipe(recipe, viewer)) {
    delete data.ingredients;
    delete data.directions;
    delete data.cookingStepImages;
    return res.send({ ...data, locked: true });
  }
  res.send({ ...data, locked: false });
});

// POST: Spend coins to unlock another user's recipe; the author earns them
router.post("/:id/buy", [validateObjectId, auth], async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "author",
      AUTHOR_FIELDS
    );
    if (!recipe) return res.status(404).send("Recipe not found");

    const buyer = await User.findById(req.user._id).select("boughtRecipes");
    if (canViewRecipe(recipe, buyer))
      return res.status(400).send("You already have access to this recipe.");

    // Conditional update so the balance can't go negative or be charged twice
    const updated = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        coins: { $gte: recipe.price },
        boughtRecipes: { $ne: recipe._id },
      },
      { $inc: { coins: -recipe.price }, $push: { boughtRecipes: recipe._id } },
      { new: true }
    );
    if (!updated)
      return res
        .status(400)
        .send(`You need ${recipe.price} coins to unlock this recipe.`);

    const authorId = authorIdOf(recipe);
    if (authorId) {
      await User.updateOne(
        { _id: authorId },
        {
          $inc: {
            coins: recipe.price,
            "unseenEarnings.coins": recipe.price,
            "unseenEarnings.sales": 1,
          },
        }
      );
    }

    res.send({
      success: true,
      coinsSpent: recipe.price,
      coins: updated.coins,
      authorName: authorNameOf(recipe),
    });
  } catch (error) {
    res.status(500).send("Could not unlock the recipe.");
  }
});

// POST: Like or unlike a recipe
router.post("/:id/like", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "author",
      AUTHOR_FIELDS
    );
    if (!recipe) return res.status(404).send("Recipe not found");

    const userId = req.user._id;
    const userLikedIndex = recipe.likes.indexOf(userId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");
    if (!canViewRecipe(recipe, user))
      return res.status(403).send("Unlock this recipe to like it.");

    let coinsAwarded = 0;
    if (userLikedIndex === -1) {
      // User hasn't liked, so add like
      recipe.likes.push(userId);
      recipe.likeCount += 1;
      user.likedRecipes.push(recipe._id);
      coinsAwarded = await rewardAuthor(recipe, userId, {
        rewardedField: "likeRewardedBy",
        amount: COINS.LIKE_REWARD,
        counter: "likes",
      });
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

    res.send({
      success: true,
      likeCount: recipe.likeCount,
      coinsAwarded,
      authorName: authorNameOf(recipe),
    });
  } catch (error) {
    res.status(500).send("Error processing like");
  }
});

module.exports = router;
