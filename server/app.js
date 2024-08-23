
const winston = require('winston');
const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();//we call the function
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`App is listening on port ${port}`));


module.exports = server;