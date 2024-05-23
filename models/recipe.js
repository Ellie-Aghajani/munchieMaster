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
    meal: {
        type:mealSchema,
        required: true
    }
}));


function validateRecipe(recipe){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        mealId: Joi.objectId().required()
    });
    return schema.validate(recipe);
};


module.exports.Recipe = Recipe;
module.exports.validate = validateRecipe;