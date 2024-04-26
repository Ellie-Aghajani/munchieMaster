const express = require('express');
const router = express.Router();

const recepies = [
    {id: 1, name:'pizza'},
    {id: 2, name:'rice'},
    {id: 3, name:'cake'},
    {id: 4, name:'soup'}

];

router.get('/', (req, res) => {
    res.send(recepies);
});

router.post('/', (req, res) => {

    const {error} = validateRecepie(req.body);


    if(error) return res.status(400).send(error.details[0].message);
   
    const recepie = {
        id: recepies.length + 1,
        name:req.body.name
    };
    recepies.push(recepie);
    res.send(recepie);
});



router.get('/:id', (req, res)=>{
    const recepie = recepies.find(r => r.id === parseInt(req.params.id));
    if(!recepie) return res.status(404).send('The recepie with the given id was not found');
    res.send(recepie);
});

router.put('/:id', (req, res)=>{
    // Look up the r
    const recepie = recepies.find((r)=>r.id === parseInt(req.params.id));
    // If not existing, return 404
    if(!recepie) return res.status(404).send('recepie not found');
    res.send(recepie);
    // Validate
   
    const {error} = validateRecepie(req.body);
    // If invalid, return 400 - Bad request
    if(error) return res.status(400).send(error.details[0].message);
    
    // Update r
    recepie.name = req.body.name;
    // Return the updated r
    res.send(recepie);
});

router.delete('/:id', (req, res)=>{
    // Look up the r
    const recepie = recepies.find(r => r.id === parseInt(req.params.id));

    // Not existing, return 404
    if (!recepie)return res.status(404).send('recepie not found');
   
    // Delete
    const index = recepies.indexOf(recepie);
    recepies.splice(index, 1);
    // Return the same r
    res.send(recepie);
})


function validateRecepie(recepie){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(recepie);
};


module.exports = router;