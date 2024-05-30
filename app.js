const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();//we call the function
//in terminal we should set the key lik e:
//export munchie_jwtPrivateKey=*****


if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}




if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('morgan enabled...');
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));