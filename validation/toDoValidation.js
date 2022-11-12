const Validator = require('validator')
const isEmpty = require('./isEmpty')

const validateToDoInput = (data) => {
    let errors = {

    }

    if(isEmpty(data.content)) {
        errors.content = 'Content field can not be empty'
    } else if(!Validator.isLength(data.content, {min: 4, max: 100})) {
        errors.content = "Content field must be between 4 and 100 characters"
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validateToDoInput

