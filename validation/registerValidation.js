const Validator = require('validator')
const router = require('../routes/auth')
const isEmpty = require('./isEmpty')

const validateRegisterInput =(data) => {
    let errors = {}

    if(isEmpty(data.email)) {
        errors.email = 'Email field can not be empty'
    } else if(!Validator.isEmail(data.email)){
        errors.email = 'Email is invalid'
    }

    if(isEmpty(data.password)) {
        errors.password = 'Password field can not be empty'
    } else if(!Validator.isLength(data.password, {min: 6, max: 40})) {
        errors.password = "Password too short, must be between 6 and 40 characters"
    }

    if(isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Confirm password field can not be empty'
    } else if(!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Password and confirm password must match"
    }

    if(isEmpty(data.name)) {
        errors.name = 'Name field can not be emtpy'
    } else if (!Validator.isLength(data.name, {min: 2, max: 30}))
        errors.name = 'Name must containe between 2 and 30 characters'
    return {
        errors,
        isValid: isEmpty(errors)
    }

}


module.exports = validateRegisterInput