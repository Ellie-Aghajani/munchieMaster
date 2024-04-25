const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());
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
    const schema = {
        name: Joi.string().min(3).required
    }
    const result = Joi.validate(req.body, schema);
    if(result.error) {
        res.status(400).send(result.error);
        return;
    }
    const recepie = {
        id: recepies.length + 1,
        name:req.body.name
    };
    recepies.push(recepie);
    res.send(recepie);
});


app.get('/api/recepies/:id', (req, res)=>{
    const recepie = recepies.find(r => r.id === parseInt(req.params.id));
    if(!recepie) res.status(404).send('The recepie with the given id was not found');
    res.send(recepie);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));