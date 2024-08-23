const {User} = require('../../../models/user'); //load the user module and store it in constant, 
//use OBJECT destructuring syntax because the user module exports an object with two properties
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('Should return a valid jwt', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString() ,
             isAdmin: true
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload)
    })

})