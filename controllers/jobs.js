const Job = require('../models/Job');
const {BadRequestError, NotFoundError} = require('../errors');
const {StatusCodes} = require('http-status-codes');

const getAllJobs = async(req, res) =>{
    const job = await Job.find({createdBy:req.user.userId}).sort('createdBy')
    res.status(StatusCodes.OK).json({job, count:job.length})
    //res.send('Get all jobs')
}

const getJob = async(req, res) =>{
    //destructure the req
    const {user:{userId}, params:{id:jobId}} = req
    const job = await Job.findOne(
        {
            _id:jobId,
            createdBy:userId
        })
        if(!job){
            throw new NotFoundError(`No job with the id ${jobId}`)
        }
    res.status(StatusCodes.OK).json({job})

    //res.send('Get single job')
}

const createJob  = async(req, res) =>{
    req.body.createdBy = req.user.userId
    //res.json(req.user)
    //console.log(req.user)
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob  = async(req, res) =>{
    const {
        body:{company, position},
        user:{userId},
        params:{id:jobId}
    }= req
    if(company == '' || position == ''){
        throw new BadRequestError("Company and position can not be empty")
    }

    //parameters{id of job to be updated, part that needs to be updated, options}
    const job = await Job.findByIdAndUpdate(
        {createdBy:userId, _id:jobId},
        req.body,
        {new:true, runValidators:true})

        if(!job){throw new NotFoundError(`No job with id ${jobId}`)}

        res.status(StatusCodes.OK).json({job})
    res.send('Update job')
}

const deleteJob  = async(req, res) =>{
    const {user:{userId}, params:{id:jobId}} = req
    const job = await Job.findByIdAndDelete({_id:jobId, createdBy:userId})
    if(!job){
        throw new NotFoundError(`No job with the id ${job}`)
    }
    res.status(StatusCodes.OK).send("Job successfully deleted")

    //res.send('Delete job')
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}