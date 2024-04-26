const morgan = require("morgan") ;
const helmet = require ( 'helmet');
const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(helmet());

if(app.get('env') === 'development'){
    //enable morgan only in development env
    app.use(morgan('tiny'));
    console.log('morgan enabled...');

}

const recepies = [
    {id: 1, name:'pizza'},
    {id: 2, name:'rice'},
    {id: 3, name:'cake'},
    {id: 4, name:'soup'}

];

app.get('/', (req, res) => {
    res.send('Welcome to Munchimaster!');
})

app.get('/api/recepies', (req, res) => {
    res.send(recepies);
});

app.post('/api/recepies', (req, res) => {

    const {error} = validateRecepie(req.body);


    if(error) return res.status(400).send(error.details[0].message);
   
    const recepie = {
        id: recepies.length + 1,
        name:req.body.name
    };
    recepies.push(recepie);
    res.send(recepie);
});



app.get('/api/recepies/:id', (req, res)=>{
    const recepie = recepies.find(r => r.id === parseInt(req.params.id));
    if(!recepie) return res.status(404).send('The recepie with the given id was not found');
    res.send(recepie);
});

app.put('/api/recepies/:id', (req, res)=>{
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

app.delete('/api/recepies/:id', (req, res)=>{
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



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));