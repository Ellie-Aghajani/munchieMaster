const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Munchimaster!');
})

app.get('/api/recepies', (req, res) => {
    res.send(['soup', 'pizza', 'chicken']);
});

app.get('/api/recepies/:id', (req, res)=>{
    res.send(req.params.id);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));