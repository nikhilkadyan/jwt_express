const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('./verifyToken')
const { registerValidation, loginValidation, updateValidation } = require('../validations/auth')

router.post('/register', async (req, res) => {
    // Validation
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if mail already exist
    const usernameCheck = await User.findOne({ username: req.body.username })
    if (usernameCheck) return res.status(403).send('username already exist')

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create User Object
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
    })

    if (req.body.name) user.set('name', req.body.name)

    // Save user to db
    try {
        const savedUser = await user.save()
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '30m' })
        res.header('auth-token', token).send({
            uid: savedUser.id,
            username: savedUser.username,
            name: savedUser.name,
            token: token
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
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.status(404).send("No account exist with this username")

    // Check user password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send("Invalid password")

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '30m' })
    res.header('auth-token', token).send({
        uid: user.id,
        username: user.username,
        name: user.name,
        token: token
    });

})

router.get('/user', auth, async (req, res) => {
    res.send(req.user)
})

router.put('/user', auth, async (req, res) => {
    // Validation
    const { error } = updateValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if account exist
    const user = await User.findOne({ _id: req.user.id })
    console.log(req.user)
    if (!user) return res.status(401).send("Not Authorised")

    // Update Fields
    if (req.body.username) user.set('username', req.body.username)
    if (req.body.name) user.set('name', req.body.name)
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        user.set('password', hashedPassword)
    }

    // Update to db
    try {
        const savedUser = await user.save()
        if (savedUser) return res.send('Updated Successfully')
    } catch (err) {
        // Handle Err
        res.status(400).send(err.message)
    }
})

module.exports = router