const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const Joi = require('joi');

const mealSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength:5,
        maxLength:50
    }
});

const  Meal = mongoose.model('Meal', mealSchema);


function validateMeal(meal){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(meal);
};


module.exports.Meal = Meal;
module.exports.mealSchema = mealSchema;
module.exports.validate = validateMeal;