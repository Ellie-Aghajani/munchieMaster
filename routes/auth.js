const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    res.send(true);
});

function validateUser(req) {
    const schema = Joi.object({
        
        email: Joi.string().min(5).max(255).required(),
        password: passwordComplexity(complexityOptions).required()

    });
    return schema.validate(req);
}



module.exports = router;