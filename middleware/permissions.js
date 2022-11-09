const User = require('../models/User')
const jwt = require('jsonwebtoken')

const requiresAuth = async (req, res, next) => {
    const token = req.cookies["access-token"]
    let isAuth = false

    if (token) {
        try {
           
            const {userId} = jwt.verify(token, process.env.JWT_SECRET)
            try {
                const user = await User.findById(userId)

                if(user) {
                    const userToReturn = {...user._doc}
                    delete userToReturn.password
                    req.user = userToReturn
                    isAuth = true
                }
            } catch (error) {
                isAuth = false
            }

       
        } catch (error) {
            isAuth = false
        }
    } 

    if(isAuth) {
        return next()
    } else {
        return res.status(400).send("Unauthorised")
    }

}

module.exports = requiresAuth