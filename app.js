const express = require('express');
const startupDebugger = require('debug')('app:startup') ; 
//in terminal: export DEBUG=app:startup,app:db, to cancel: DEBUG=
const dbDebugger = require('debug')('app: db');
const config = require('config');
const morgan = require("morgan") ;
const helmet = require ( 'helmet');
const logger = require('./middleware/logger');
const recepies = require('./routs/recepies');
const Joi = require('joi');
const home = require('./routs/home');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(helmet());
app.use('./api/recepies', recepies);
app.use('./', home);
app.use (logger);



if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('morgan enabled...');
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));