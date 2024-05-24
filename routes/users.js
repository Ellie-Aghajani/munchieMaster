const {User, validate} = require('../models/user');
const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({emai: req.body.email})
    if (user) return res.status(400).send('User already registered.');

    user = new User ({ //const not let because mongodb driver sets the objectId here and no need to reset the variable later
        name:req.body.name,
        email: req.body.email,
        password: req.body.password
     });
    await user.save()
    res.send(user);
});




module.exports = router;