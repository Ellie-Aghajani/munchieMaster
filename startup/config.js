const config = require('config');


module.exports = function(){
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
    
}
//in terminal we should set the key lik e:
//export munchie_jwtPrivateKey=*****

