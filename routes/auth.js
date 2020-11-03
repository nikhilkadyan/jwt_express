const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('./verifyToken')
const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res) => {
    // Validation
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if mail already exist
    const emailCheck = await User.findOne({ email: req.body.email })
    if (emailCheck) return res.status(403).send('Email already exist')

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create User Object
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })

    // Save user to db
    try {
        const savedUser = await user.save()
        res.send({
            uid: savedUser.id,
            name: savedUser.name,
            email: savedUser.email
        })
    } catch (err) {
        // Handle Err
        res.status(400).send(err.message)
    }
})

router.post('/login', async (req, res) => {
    // Validation
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if account exist
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).send("No account exist on this email")

    // Check user password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send("Invalid password")

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {expiresIn: '30m'})
    res.header('auth-token', token).send(token);

})

router.get('/user', auth, async (req, res) => {
    res.send(req.user)
})
module.exports = router