const auth = require('../middleware/auth');
const mongoose = require('mongoose'); //node_8.mongo data validation_8.mp4
const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../models/customer');



router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/',auth ,async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    await customer.save();
    res.send(customer);
});



router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate( req.params.id, {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        }, { new: true});
    if(!customer) return res.status(404).send('Customer not found');
    res.send(customer);

});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findOneAndDelete(req.params.id);
    if(!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});


router.get('/:id', async(req, res)=>{
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('The customer with the given id was not found');
    res.send(customer);
});



module.exports = router;
