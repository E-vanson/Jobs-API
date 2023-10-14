const User = require('../models/User');
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req, res, next)=> {
//get header
const authHeader = req.headers.authorization
if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new UnauthenticatedError("Invalid Authorization")
}

const token = authHeader.split(' ')[1]
try {

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    //attach the user to job routes
    req.user = {userId:payload.userId, name:payload.userName};
    next()

} catch (error) {
    throw new UnauthenticatedError("Invalid authorization")
    
}
}
module.exports = auth;


