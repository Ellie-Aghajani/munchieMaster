require('express-async-errors');
const winston = require('winston'); //logger
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const startupDebugger = require('debug')('app:startup') ; 
//in terminal: export DEBUG=app:startup,app:db, to cancel: DEBUG=
const dbDebugger = require('debug')('app: db');
const morgan = require("morgan") ;
const Fawn = require('fawn');
const app = express();
require('./startup/routes')(app);
// process.on('uncaughtException', (ex) => {
//     winston.error(ex.message, ex);
//     process.exit(1);
// });
winston.handleExceptions( //error handling recap, node, 11-handling.., 10.mp4
    new winston.transports.File({ filename: 'uncaughtExceptions.log'})
);

process.on('unhandledRejection', (ex) => {
    throw ex;
});


winston.add(winston.transports.File, { filename:'logFile.log' });

// winston.add(winston.transports.MongoDB, {db: 'mongodb://localhost/munchieMaster'});
// const jwtPrivateKey = config.get('jwtPrivateKey');
// console.log('jwtPrivateKey:', jwtPrivateKey);

//in terminal we should set the key lik e:
//export munchie_jwtPrivateKey=*****

//to test error log:
// throw new Error('Something failed during startup.');
// const p = Promise.reject(new Error(' Something failed miserably!'));
// p.then(()=>console.log('done'));

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}




if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('morgan enabled...');
}

mongoose.connect('mongodb://localhost/munchieMaster')
    .then(() => {
        console.log('Connected to mongodb...');
        // Fawn.init(mongoose);
    })
    .catch(err => console.error('Could not connect to mongodb...', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));