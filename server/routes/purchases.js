const mongoose = require('mongoose'); //node_8.mongo data validation_7.mp4
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const {Purchase, validate} = require('../models/purchase');
const {Customer} = require('../models/customer');
const {Recipe} = require('../models/recipe');


Fawn.init("mongodb://localhost/munchieMaster");

router.get('/',async (req, res) => {
    const purchases = await Purchase.find().sort('-dateOfPurchase');
    res.send(purchases);
});

router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send("Invalid Customer");

    // if(recipe.numberInStock === 0) return(res.status(400).send("Recipe not available")
    const recipe = await Recipe.findById(req.body.recipeId);
    if(!recipe) return res.status(400).send('Invalid Recipe.');

    let purchase = new Purchase ({ 
        customer:{
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        recipe: {
            name: recipe.name,
            meal: recipe.meal
        }
    });
    try{
        new Fawn.Task()//all these operations will be treated as a unit
            .save('purchases', purchase)//working with the actual name of the collection which is plural
            // .update('recipes', { _id: movie._id }, {
            //     $inc: { numberInStock: -1 }
            // })
            .run();
            // purchase = await purchase.save();
            // //recipe.numberInStock--;
            // //recipe.save();
            res.send(purchase);
    }
    catch(ex){
        console.log('Ex Error: ', ex);
        res.status(500).send('Something went wrong');
    }
});




router.put('/:id', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const purchase = await Purchase.findByIdAndUpdate(req.params.id,{ name: req.body.name}, {new: true});
    if(!purchase) return res.status(404).send('purchase not found');
    res.send(purchase);
    
});

router.delete('/:id', async(req, res)=>{
    const purchase = await Purchase.findOneAndDelete(req.params.id);
    if (!purchase)return res.status(404).send('purchase not found');
    res.send(purchase);
})

router.get('/:id', async(req, res)=>{
    const purchase = await Purchase.findById(req.params.id);
    if(!purchase) return res.status(404).send('The purchase with the given id was not found');
    res.send(purchase);
});



module.exports = router;