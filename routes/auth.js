const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const validateRegisterInput = require('../validation/registerValidation')

// @ GET/api/auth/test
// @ test the auth route
// @ public

router.get('/test', (req, res)  => {
    res.send('Auth route working')
})

router.post('/register', async (req, res) => {
    try {
        const {errors, isValid} = validateRegisterInput(req.body)

        if(!isValid) {
            return res.status(400).json(errors)
        }

        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i")})

        if(existingEmail) {
            return res.status(400).json({msg: `User with email ${existingEmail.email} already exists`})
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12)

        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        })

        const savedUser = await newUser.save()
        return res.json(savedUser)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.msg)
    }
})

module.exports = router