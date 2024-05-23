const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength:5,
        maxLength:50
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength:8,
        maxLength:10
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().required(),
        password: Joi.string().min(8).max(10).required()

    })
    return schema.validate(user);
}


module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validate = validateUser;

