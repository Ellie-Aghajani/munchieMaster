const mongoose = require('mongoose');
const winston = require('winston');


module.exports = function(){
    mongoose.connect('mongodb://localhost/munchieMaster')
        .then(() => {
            winston.info('Connected to mongodb...'); //log as information message using winston
        })
}    


