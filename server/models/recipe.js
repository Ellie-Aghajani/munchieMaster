const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const Joi = require('joi');
const {mealSchema} = require('./meal');



const Recipe = mongoose.model('Recipe', new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength:5,
        maxLength:50,
    },
    image: {
        type: String,
        required: false
    },
    preparationTime: {
        type: String, 
        required: false
    },
    ingredients: {
        type: [String], 
        required: true
    },
    directions: {
        type: [String],
        required: true
    },
    meal: {
        type:mealSchema,
        required: true
    }
}));


function validateRecipe(recipe){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        image: Joi.string().uri().optional(),
        preparationTime: Joi.string().optional(),
        ingredients: Joi.array().items(Joi.string()).required(),
        directions: Joi.array().items(Joi.string()).required(),
        mealId: Joi.objectId().required()
    });
    return schema.validate(recipe);
};


module.exports.Recipe = Recipe;
module.exports.validate = validateRecipe;