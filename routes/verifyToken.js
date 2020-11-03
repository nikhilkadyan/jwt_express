const { compare } = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async function (req, res , next){
    const token = req.header('auth-token')

    if(!token) return res.status(401).send('Access Denied')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        const user = await User.findOne({ _id: verified.id })
        if(user){
            req.user = {
                id: user.id,
                name: user.name,
                email: user.email
            }
            next();
        } else {
            res.status(401).send('Invalid Token')
        }
    } catch (err) {
        res.status(401).send('Invalid Token')
    }
}