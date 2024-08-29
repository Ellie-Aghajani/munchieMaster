const mongoose = require("mongoose"); //node_8.mongo data validation_7.mp4
const Joi = require("joi");
const { mealSchema } = require("./meal");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  image: {
    type: String,
    required: false,
  },
  preparationTime: {
    type: String,
    required: false,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  directions: {
    type: [String],
    required: true,
  },
  // meal: {
  //     type:mealSchema,
  //     required: true
  // },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likeCount: { type: Number, default: 0 },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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
  });

  return schema.validate(recipe);
}

module.exports.Recipe = Recipe;
module.exports.validate = validateRecipe;
