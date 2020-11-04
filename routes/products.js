const router = require('express').Router()
const Product = require('../models/Product')
const auth = require('./verifyToken')
const { createValidation, updateValidation } = require('../validations/Product')

// Get All Product
router.get('/', async (req, res) => {
    let rawProducts = await Product.find({}, (err, result) => {
        if (err) return res.status(400).send(err)
        return result
    })

    let products = []
    rawProducts.forEach(p => {
        p.secret = null
        products.push(p)
    });

    res.send(products)
})

// Create New Product
router.post('/', auth, async (req, res) => {
    // Validation
    const { error } = createValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Create Product Object
    const product = new Product({
        title: req.body.title,
        desc: req.body.desc,
        demo: req.body.demo,
        secret: req.body.secret,
        prices: {
            INR: req.body.prices.INR,
            USD: req.body.prices.USD,
        },
    })

    // Save Product to db
    try {
        const savedProduct = await product.save()
        res.send(savedProduct)
    } catch (err) {
        // Handle Err
        res.status(400).send(err.message)
    }
})

// Update Product
router.put('/:id', auth, async (req, res) => {
    // Validation
    const { error } = updateValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if product exist
    const product = await Product.findOne({ _id: req.params.id })
    if (!product) return res.status(404).send("No Product with this id exist")

    // Update Fields
    if(req.body.title) product.set('title', req.body.title)
    if(req.body.desc) product.set('desc', req.body.desc)
    if(req.body.demo) product.set('demo', req.body.demo)
    if(req.body.secrect) product.set('secrect', req.body.secrect)
    if(req.body.prices){
        if(req.body.prices.INR) product.set('prices.INR', req.body.prices.INR)
        if(req.body.prices.USD) product.set('prices.USD', req.body.prices.USD)
    }

    // Update to db
    try {
        const savedProduct = await product.save()
        res.send(savedProduct)
    } catch (err) {
        // Handle Err
        res.status(400).send(err.message)
    }
})

// Delete Product
router.delete('/:id', auth, async (req, res) => {
    if(!req.params.id) return res.status(400).send('Product ID is required')

    // Check if product exist
    const product = await Product.findOne({ _id: req.params.id })
    if (!product) return res.status(404).send("No Product with this id exist")

    // Delete from db
    try {
        const deleteProduct = await product.deleteOne()
        if(deleteProduct) return res.send("Product Successfully Deleted")
    } catch (err) {
        // Handle Err
        res.status(400).send(err.message)
    }

})

module.exports = router