const mongoose = require('mongoose');
const Joi = require('joi');


const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold:{ 
        type:Boolean,
        default: false
    },
    name: {
        type: String,
        minLength:5,
        maxLength: 50,
        required: true
    },
    phone: {
        type: String,
        minLength:5,
        maxLength: 50,
        required: true
    }
}));



function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    });
    return schema.validate(customer);
};


module.exports.Customer = Customer;
module.exports.validate = validateCustomer;