const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const express = require('express');
const multer = require('multer'); 
const router = express.Router();
const { Recipe, validate} = require('../models/recipe');
const { Meal } = require('../models/meal');


// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Save with a timestamp to avoid name conflicts
    }
});

const upload = multer({ storage });



router.get('/', async (req, res) => {
    try{
        const recipes = await Recipe.find().sort('name');
        res.send(recipes);
    } catch(ex){
        res.status(500).send('Could not retrieve recipes.');
    }
});

router.post('/', auth, async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const meal = await Meal.findById(req.body.mealId);
    if(!meal) return res.status(400).send('Invalid meal.');

    const recipe = new Recipe ({ //const not let because mongodb driver sets the objectId here and no need to reset the variable later
        name:req.body.name,
        image: req.body.image,
        preparationTime: req.body.preparationTime,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        meal:{ 
            _id: meal._id,
            name:meal.name,
        }
     });
     try{
         await recipe.save()
         res.send(recipe);
     } catch(ex){
        res.status(500).send('Could not save recipe.');
     }
});




router.put('/:id', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const recipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        { 
            name: req.body.name,
            image: req.body.image,
            preparationTime: req.body.preparationTime,
            ingredients: req.body.ingredients,
            directions: req.body.directions
        }, 
        {new: true}
    );
    if(!recipe) return res.status(404).send('recipe not found');
    res.send(recipe);
    
});

router.delete('/:id', [auth, admin],async(req, res)=>{
    const recipe = await Recipe.findOneAndDelete(req.params.id);
    if (!recipe)return res.status(404).send('recipe not found');
    res.send(recipe);
})

router.get('/:id',validateObjectId , async(req, res)=>{

    const recipe = await Recipe.findById(req.params.id);
    if(!recipe) return res.status(404).send('The recipe with the given id was not found');
    res.send(recipe);
});



module.exports = router;