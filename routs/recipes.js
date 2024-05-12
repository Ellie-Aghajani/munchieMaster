const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const express = require('express');
const router = express.Router();


const Recipe = mongoose.model('Recipe', new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength:5,
        maxLength:50,
    }
}));



router.get('/',async (req, res) => {
    const recipes = await Recipe.find().sort('name');
    res.send(recipes);
});

router.post('/', async (req, res) => {

    const {error} = validateRecipe(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    let recipe = new Recipe ({ name:req.body.name });
    recipe = await recipe.save()
    res.send(recipe);
});




router.put('/:id', async (req, res)=>{
    const {error} = validateRecipe(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const recipe = await Recipe.findByIdAndUpdate(req.params.id,{ name: req.body.name}, {new: true});
    if(!recipe) return res.status(404).send('recipe not found');
    res.send(recipe);
    
});

router.delete('/:id', async(req, res)=>{
    const recipe = await Recipe.findByIdAndRemove(req.params.id);
    if (!recipe)return res.status(404).send('recipe not found');
    res.send(recipe);
})

router.get('/:id', async(req, res)=>{
    const recipe = await Recipe.findById(req.params.id);
    if(!recipe) return res.status(404).send('The recipe with the given id was not found');
    res.send(recipe);
});

function validateRecipe(recipe){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(recipe);
};


module.exports = router;