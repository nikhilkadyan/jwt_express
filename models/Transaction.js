const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    uid: {
        type: String,
        min: 6
    },
    payment_method: {
        type: String,
        required: true,
        min: 6
    },
    product_name: {
        type: String,
        required: true,
        min: 6
    },
    download: {
        type: String,
        required: true,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Transaction', transactionSchema);