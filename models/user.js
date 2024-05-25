const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');


const complexityOptions = {
    min: 8,
    max: 26,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
};

const userSchema =  new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength:5,
        maxLength:50
    },
    email: {
        type: String,
        unique: true,
        minLength:5,
        maxLength:255
    },
    password: {
        type: String,
        required: true,
        minLength:5,
        maxLength:1024
    },
});

userSchema.methods.generateAuthToken = function(){
    const token =  jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required(),
        password: passwordComplexity(complexityOptions).required()

    });
    return schema.validate(user);
}



module.exports.User = User;
module.exports.validate = validateUser;

