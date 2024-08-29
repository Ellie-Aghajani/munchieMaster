const auth = require('../middleware/auth'); //authorization: user has permission to access
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const express = require('express');
const { Recipe } = require('../models/recipe');
const router = express.Router();


router.get('/me', auth,  async(req, res) => {
   const user = await User.findById(req.user._id).select('-password');
   res.send(user);
})

router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email})
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name','email' ,'password' , 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token =  user.generateAuthToken();
    res.header('x-auth-token', token ).send( _.pick(user, ['_id','email',"name", 'isAdmin']));
});




module.exports = router;

router.post('/save-recipe', auth, async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const recipe = await Recipe.findById(recipeId);
    const index = user.savedRecipes.indexOf(recipeId);
    
    if (index > -1) {
      user.savedRecipes.splice(index, 1);
      recipe.savedBy = recipe.savedBy.filter(id => id.toString() !== userId.toString());
    } else {
      user.savedRecipes.push(recipeId);
      recipe.savedBy.push(userId);
    }

    await user.save();
    await recipe.save();
    res.json({ success: true, savedRecipes: user.savedRecipes, savedByCount: recipe.savedBy.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.get('/saved-recipes', auth, async (req, res) => {
  try {

    const user = await User.findById(req.user._id).populate('savedRecipes');
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/liked-recipes', auth, async (req, res) => {
  try {

    const user = await User.findById(req.user._id).populate('likedRecipes');
    res.json({ likedRecipes: user.likedRecipes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
