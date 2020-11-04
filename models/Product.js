const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    desc: {
        type: String,
        required: true,
        min: 6
    },
    demo: {
        type: String,
        required: true,
        min: 6
    },
    secret: {
        type: String,
        required: true,
        min: 6
    },
    prices: {
        INR: {
            type: Number,
            required: true
        },
        USD: {
            type: Number,
            required: true
        }
    }
})

module.exports = mongoose.model('Product', productSchema);