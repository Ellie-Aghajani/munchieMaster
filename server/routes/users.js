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
const Joi = require("joi");
const { removeUpload } = require("../utils/uploads");
const winston = require("winston");
const {
  sendVerificationEmail,
  hashToken,
  canResend,
} = require("../utils/verification");
const {
  COINS,
  RECIPE_SUMMARY_FIELDS,
  authorNameOf,
  rewardAuthor,
} = require("../utils/coins");

// GET current user data (without password)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -verificationTokenHash -verificationExpires -verificationSentAt"
    );
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET coins earned from other users since the last visit, then reset them
router.get("/coin-notice", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          unseenEarnings: { coins: 0, likes: 0, saves: 0, sales: 0, refunds: 0 },
        },
      },
      { new: false }
    ).select("unseenEarnings coins");
    if (!user) return res.status(404).send("User not found");
    res.send({
      ...(user.unseenEarnings?.toObject?.() || {
        coins: 0,
        likes: 0,
        saves: 0,
        sales: 0,
        refunds: 0,
      }),
      balance: user.coins,
    });
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

  // isAdmin is never taken from the request; admins are set in the database
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.emailVerified = false;
  await user.save();

  // No login until the email is confirmed; the link in the email logs them in
  try {
    await sendVerificationEmail(user, req);
  } catch (error) {
    winston.error(`Verification email to ${user.email} failed: ${error.message}`);
    return res.send({ verificationSent: false, email: user.email });
  }
  res.send({ verificationSent: true, email: user.email });
});

// POST: Confirm an email address with the token from the verification link
router.post("/verify-email", async (req, res) => {
  const token = typeof req.body.token === "string" ? req.body.token : "";
  if (!token) return res.status(400).send({ code: "INVALID_LINK" });

  const user = await User.findOne({ verificationTokenHash: hashToken(token) });
  if (!user) return res.status(400).send({ code: "INVALID_LINK" });
  if (user.verificationExpires < new Date())
    return res.status(400).send({ code: "EXPIRED_LINK", email: user.email });

  user.emailVerified = true;
  user.verificationTokenHash = undefined;
  user.verificationExpires = undefined;
  await user.save();
  res.send({ token: user.generateAuthToken() });
});

// POST: Send a new verification link. The reply is the same whether or not
// the email exists, so this can't be used to find out who has an account.
router.post("/resend-verification", async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
  const user = email ? await User.findOne({ email }) : null;
  if (user && user.emailVerified === false && canResend(user)) {
    try {
      await sendVerificationEmail(user, req);
    } catch (error) {
      winston.error(`Verification email to ${user.email} failed: ${error.message}`);
    }
  }
  res.send({ success: true });
});

// Never send the password hash to the client
const toSafeUser = (user) => {
  const data = user.toObject();
  delete data.password;
  delete data.verificationTokenHash;
  delete data.verificationExpires;
  delete data.verificationSentAt;
  return data;
};

const PROFILE_FIELDS = [
  "name",
  "firstName",
  "lastName",
  "country",
  "province",
  "city",
  "description",
];

const optionalText = (max) => Joi.string().trim().allow("").max(max);
const profileSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50),
  firstName: optionalText(50),
  lastName: optionalText(50),
  country: optionalText(50),
  province: optionalText(50),
  city: optionalText(50),
  description: optionalText(500),
});

// PUT: Update profile fields; an empty value clears the field
router.put("/me", auth, async (req, res) => {
  const { error, value } = profileSchema.validate(_.pick(req.body, PROFILE_FIELDS));
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    Object.entries(value).forEach(([field, fieldValue]) => {
      user[field] = fieldValue === "" ? undefined : fieldValue;
    });

    await user.save();
    res.send({ success: true, user: toSafeUser(user) });
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
    const recipe = await Recipe.findById(recipeId).populate(
      "author",
      "name firstName"
    );
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    const index = user.savedRecipes.indexOf(recipeId);
    let coinsAwarded = 0;

    if (index > -1) {
      user.savedRecipes.splice(index, 1);
      recipe.savedBy = recipe.savedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      user.savedRecipes.push(recipeId);
      recipe.savedBy.push(userId);
      coinsAwarded = await rewardAuthor(recipe, userId, {
        rewardedField: "saveRewardedBy",
        amount: COINS.SAVE_REWARD,
        counter: "saves",
      });
    }

    await user.save();
    await recipe.save();
    res.json({
      success: true,
      savedRecipes: user.savedRecipes,
      savedByCount: recipe.savedBy.length,
      coinsAwarded,
      authorName: authorNameOf(recipe),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT: Upload or replace the profile photo
router.put("/avatar", auth, upload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  const newAvatar = `/uploads/${req.file.filename}`;
  if (!req.file.mimetype.startsWith("image/")) {
    removeUpload(newAvatar);
    return res.status(400).send("Please choose an image file.");
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      removeUpload(newAvatar);
      return res.status(404).send("User not found");
    }

    const oldAvatar = user.avatar;
    user.avatar = newAvatar;
    await user.save();
    removeUpload(oldAvatar);
    res.send({ success: true, user: toSafeUser(user) });
  } catch (error) {
    removeUpload(newAvatar);
    res.status(500).send("Server error");
  }
});

// DELETE: Remove the profile photo
router.delete("/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    const oldAvatar = user.avatar;
    user.avatar = undefined;
    await user.save();
    removeUpload(oldAvatar);
    res.send({ success: true, user: toSafeUser(user) });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET: Retrieve user's saved recipes
router.get("/saved-recipes", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedRecipes",
      select: RECIPE_SUMMARY_FIELDS,
    });
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Retrieve user's liked recipes
router.get("/liked-recipes", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "likedRecipes",
      select: RECIPE_SUMMARY_FIELDS,
    });
    res.json({ likedRecipes: user.likedRecipes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
