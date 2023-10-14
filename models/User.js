const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Please enter password'],
        maxLength: 20,
        minLength: 3
    },
    email:{
        type: String,
        required: [true, 'Please enter your email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
                'Please provide valid email'],
        unique: true        
    },
    password:{
        type: String,
        required: [true, 'Please enter your password'],
        minLength: 6,
        // maxLength: 12,
    }

})

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    //the next() is optional
    next()
})

//method for getting the name of a user
// UserSchema.methods.getName = function (){
//     return this.name;
// }

UserSchema.methods.getJWT = function(){
    return jwt.sign(
        {
        userName:this.name,
         userId:this._id
        }, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_LIFETIME}
        )
}

UserSchema.methods.comparePassword = async function(candidatePassword){
const isMatch = await bcrypt.compare(candidatePassword, this.password)
return isMatch;
}

module.exports =  mongoose.model('User', UserSchema)

