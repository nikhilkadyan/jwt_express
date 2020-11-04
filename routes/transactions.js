const router = require('express').Router()
const Transaction = require('../models/Transaction')
const Product = require('../models/Product')
const auth = require('./verifyToken')
const { createValidation } = require('../validations/transcation')

// Get All Transaction
router.get('/', (req, res) => {
    Transaction.find({}, (err, result) => {
        if (err) return res.status(400).send(err)
        res.send(result)
    })
})

// Get All User Transaction
router.get('/user/:id', (req, res) => {
    Transaction.find({uid: req.params.id}, (err, result) => {
        if (err) return res.status(400).send(err)
        res.send(result)
    })
})

// Create New Transcation
router.post('/', async (req, res) => {
    // Validation
    const { error } = createValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const product = await Product.findOne({ _id: req.body.product_id })

    // Create Product Object
    const transaction = new Transaction({
        payment_method: req.body.payment_method,
        product_name: product.title,
        download: product.secret,
    })

    if(req.body.uid) transaction.set('uid', req.body.uid)

    // Save Product to db
    try {
        const savedTransaction = await transaction.save()
        if(savedTransaction){
            res.send(product.secret)
        }
    } catch (err) {
        // Handle Err
        res.status(400).send(err.message)
    }
})

module.exports = router