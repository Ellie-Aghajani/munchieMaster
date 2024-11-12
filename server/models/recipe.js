const mongoose = require("mongoose");
const Joi = require("joi");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 5, maxLength: 50 },
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
  });

  return schema.validate(recipe);
}

module.exports.Recipe = Recipe;
module.exports.validate = validateRecipe;
