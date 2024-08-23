const mongoose = require('mongoose');
const Joi = require('joi');
const {mealSchema} = require('./meal');



const Purchase = mongoose.model('Purchase',new mongoose.Schema({
    customer:{
        type: new mongoose.Schema({
            name: {
                type: String,
                minLength:5,
                maxLength: 50,
                required: true
            },
            isGold:{ 
                type:Boolean,
                default: false
            },
            phone: {
                type: String,
                minLength:5,
                maxLength: 50,
                required: true
            }
        })

    },
    recipe:{
        type: new mongoose.Schema({
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
        })
    
    },
    dateOfPurchase:{
        type: Date,
        required: true,
        default: Date.now
    },
    price: {
        type: Number,
        min: 0,
        required: true
    }
}) );



function validatePurchase(purchase){
    const schema = Joi.object({
        customerId : Joi.objectId().required(),
        recipeId: Joi.objectId().required()
    });
    return schema.validate(purchase);
}


module.exports.validate = validatePurchase;
module.exports.Purchase = Purchase;