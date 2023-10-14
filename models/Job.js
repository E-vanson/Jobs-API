const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    company:{
        type:String,
        requried:[true, 'Please provide company'],
        maxlength:50
    },
    position:{
        type: String,
        required:[true, 'Please provide position'],
        maxlength: 100
    },
    status:{
        type:String,
        enum:['pending', 'declined', 'interview'],
        default: 'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'Please provide user']
    }
},
{timestamps:true} //created at and updated at properties
)

module.exports = mongoose.model('Job', jobSchema)