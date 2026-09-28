const mongoose = require("mongoose");
const Joi = require("joi");

// Meal categories a recipe can belong to (one or more)
const CATEGORIES = ["breakfast", "lunch", "dinner", "snack", "sweets"];
// Dietary flags a recipe can have
const DIETS = ["isVegetarian", "isGlutenFree", "isKetoFriendly"];

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  image: { type: String },
  preparationTime: { type: String },
  ingredients: { type: [String], required: true },
  directions: { type: [String], required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likeCount: { type: Number, default: 0 },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  price: { type: Number, default: 0 }, // price in coins for featured recipes
  isFeatured: { type: Boolean, default: false },
  cookingStepImages: [{ type: String, maxLength: 3 }],
  // Posting user; empty for the default recipes, which are free
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Users whose like or save already paid the author, so undo/redo pays nothing
  likeRewardedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  saveRewardedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  categories: [{ type: String, enum: CATEGORIES }],
  isVegetarian: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isKetoFriendly: { type: Boolean, default: false },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

function validateRecipe(recipe) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    ingredients: Joi.array().items(Joi.string()).min(1).required(),
    directions: Joi.array().items(Joi.string()).min(1).required(),
    preparationTime: Joi.string().required(),
    image: Joi.string().uri(),
    likeCount: Joi.number().min(0),
    savedBy: Joi.array().items(Joi.objectId()),
    price: Joi.number().integer().min(0), // Validate price as non-negative integer
    isFeatured: Joi.boolean(), // Validate that isFeatured is a boolean
    cookingStepImages: Joi.array().items(Joi.string().uri()).max(3),
    categories: Joi.array()
      .items(Joi.string().valid(...CATEGORIES))
      .min(1)
      .unique()
      .required()
      .messages({ "any.required": "Choose at least one category" }),
    // Form data sends "true"/"false"; Joi converts them to booleans
    isVegetarian: Joi.boolean(),
    isGlutenFree: Joi.boolean(),
    isKetoFriendly: Joi.boolean(),
  });

  return schema.validate(recipe);
}

module.exports.Recipe = Recipe;
module.exports.validate = validateRecipe;
module.exports.CATEGORIES = CATEGORIES;
module.exports.DIETS = DIETS;
