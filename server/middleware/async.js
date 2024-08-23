module.exports = function(handler){
    return async(req, res, next) => {
        try{
            await handler(req, res);
        }
        catch(ex){
            next(ex);
        }
    }

}


//this middleware function is used to wrap the route handler functions 
//if the 'express-async-errors npm package is not used