const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError} = require('../errors')
const {UnauthenticatedError} = require('../errors')
//const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const register = async (req,res) =>{
    //res.send('Registered user')
    //checking for errors in the controller using the bad request error
    // const {name, email, password} = req.body
    // if(!name || !email || !password){
    //     throw new BadRequestError("Please provide name, email and password")
    // }

    //hashing passowordsss
    // const {name, email, password} = req.body
    
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)
    // //console.log(hashedPassword);

    // const tempUser = {name, email, password:hashedPassword}
    // console.log({hashedPassword})

    // //console.log({tempUser})
    
    const user = await User.create({...req.body})
    console.log(user)
    const token = user.getJWT()
    console.log(token)
   
    res.status(StatusCodes.CREATED).json({user: {name:user.name}, token})
    //console.log( res.status(StatusCodes.CREATED).json({user: {name:user.name}, token}))
}

const login = async (req, res) =>{
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user =await User.findOne({email})
    //res.send('Login user')
   
    if(!user){
        throw new UnauthenticatedError("Invalid credentials")
    }

     //compare passwords
     const isPasswordCorrect = await    user.comparePassword(password)
     if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid credentials")
     }

    const token = user.getJWT()

    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {
    register,
    login
}