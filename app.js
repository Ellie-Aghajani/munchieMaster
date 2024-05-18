const mongoose = require('mongoose');
const express = require('express');
const startupDebugger = require('debug')('app:startup') ; 
//in terminal: export DEBUG=app:startup,app:db, to cancel: DEBUG=
const dbDebugger = require('debug')('app: db');
const config = require('config');
const morgan = require("morgan") ;
const helmet = require ( 'helmet');
const logger = require('./middleware/logger');
const recipes = require('./routes/recipes');
const customers = require('./routes/customers');
const meals = require('./routes/meals');
const Joi = require('joi');
const home = require('./routes/home');
const app = express();

mongoose.connect('mongodb://localhost/munchieMaster')
    .then(() => console.log('Connected to mongodb...'))
    .catch(err => console.error('Could not connect to mongodb...', err));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(helmet());
app.use('/api/recipes', recipes);
app.use('/api/customers', customers);
app.use('/api/meals', meals);
app.use('/', home);
app.use (logger);



if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('morgan enabled...');
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));