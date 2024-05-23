const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');



router.get('/',async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = new User ({ //const not let because mongodb driver sets the objectId here and no need to reset the variable later
        name:req.body.name,
        email: req.body.email,
        password: req.body.password
     });
    await User.save()
    res.send(user);
});




router.put('/:id', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findByIdAndUpdate(req.params.id,{ name: req.body.name}, {new: true});
    if(!user) return res.status(404).send('user not found');
    res.send(user);
    
});

router.delete('/:id', async(req, res)=>{
    const user = await User.findOneAndDelete(req.params.id);
    if (!user)return res.status(404).send('user not found');
    res.send(user);
})

router.get('/:id', async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('The user with the given id was not found');
    res.send(user);
});



module.exports = router;