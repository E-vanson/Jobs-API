const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  //create an error object
  let customError = {
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message||'Something went wrong please try again'
  }


  //cast error
  if(err.name === 'CastError'){
    customError.msg = `No job found with id: ${err.value} `
  }

  //if the error is a validation error
  if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).
    map((item) => item.message).join(',')
    //console.log(Object.values(err.errors))
  }

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  //if it's a duplication error]
  if(err.code && err.code === 11000){
    customError.msg = `Duplicate value in the ${Object.keys(err.keyValue)} value, please input another value` 
    customError.statusCode = 400
  }
  return res.status(customError.statusCode).json({msg:customError.msg})
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}




module.exports = errorHandlerMiddleware
