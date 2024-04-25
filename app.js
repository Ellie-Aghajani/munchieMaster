const express = require('express');
const app = express();
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

app.get('/api/recepies/:id', (req, res)=>{
    const recepie = recepies.find(r => r.id === parseInt(req.params.id));
    if(!recepie) res.status(404).send('The recepie with the given id was not found');
    res.send(recepie);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));