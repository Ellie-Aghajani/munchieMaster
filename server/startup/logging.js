const winston = require('winston'); //logger
// require('winston-mongodb');
require('express-async-errors');



module.exports = function (){
    winston.handleExceptions( //error handling recap, node, 11-handling.., 10.mp4
        new winston.transports.Console({ colorize: true, prettyPrint: true }) ,
        new winston.transports.File({ filename: 'uncaughtExceptions.log'})
    );

    process.on('unhandledRejection', (ex) => {
    throw ex;
    });


    winston.add(winston.transports.File, { filename:'logFile.log' });
    // winston.add(winston.transports.MongoDB, {
    //  db: 'mongodb://localhost/munchieMaster',
    //  level: 'info
    //});

}