const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const express = require('express');
const router = express.Router();
const { Recipe, validate} = require('../models/recipe');
const { Meal } = require('../models/meal');




router.get('/',async (req, res) => {
    const recipes = await Recipe.find().sort('name');
    res.send(recipes);
});

router.post('/', auth, async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const meal = await Meal.findById(req.body.mealId);
    if(!meal) return res.status(400).send('Invalid meal.');

    const recipe = new Recipe ({ //const not let because mongodb driver sets the objectId here and no need to reset the variable later
        name:req.body.name,
        meal:{ 
            _id: meal._id,
            name:meal.name,
        }
     });
    await recipe.save()
    res.send(recipe);
});




router.put('/:id', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const recipe = await Recipe.findByIdAndUpdate(req.params.id,{ name: req.body.name}, {new: true});
    if(!recipe) return res.status(404).send('recipe not found');
    res.send(recipe);
    
});

router.delete('/:id', [auth, admin],async(req, res)=>{
    const recipe = await Recipe.findOneAndDelete(req.params.id);
    if (!recipe)return res.status(404).send('recipe not found');
    res.send(recipe);
})

router.get('/:id', async(req, res)=>{
    const recipe = await Recipe.findById(req.params.id);
    if(!recipe) return res.status(404).send('The recipe with the given id was not found');
    res.send(recipe);
});



module.exports = router;