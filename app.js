
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();//we call the function
require('./startup/config')();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));