const jwt = require('jsonwebtoken');
const config = require('config');



module.exports = function(req, res, next){

    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided.')

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey')); //it will decode the token and return the payload
//now that we have the payload in the decoded, we put that in the request
//we set the request object, user property to decoded
        req.user = decoded;//in route handler we have access to req.user._id of the payload
//now pass control to next middleware function in the request processing pipeline(route handler)
        next();
    }
    catch(ex){
        res.status(400).send('invalid token');//troubleshoot authentication issues
    }
    
};




