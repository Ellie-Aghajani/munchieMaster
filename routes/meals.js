const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const express = require('express');
const router = express.Router();
const {Meal, validate} = require('../models/meal');




router.get('/',async (req, res) => {
    const meals = await Meal.find().sort('name');
    res.send(meals);
});

router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const meal = new Meal ({ name:req.body.name });
    await meal.save()
    res.send(meal);
});




router.put('/:id', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const meal = await Meal.findByIdAndUpdate(req.params.id,{ name: req.body.name}, {new: true});
    if(!meal) return res.status(404).send('meal not found');
    res.send(meal);
    
});

router.delete('/:id', async(req, res)=>{
    const meal = await Meal.findOneAndDelete(req.params.id);
    if (!meal)return res.status(404).send('meal not found');
    res.send(meal);
})

router.get('/:id', async(req, res)=>{
    const meal = await Meal.findById(req.params.id);
    if(!meal) return res.status(404).send('The meal with the given id was not found');
    res.send(meal);
});



module.exports = router;