const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
    link: {
        type: String,
        required: true,
        min: 6
    },
    source: {
        type: String,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Project', projectSchema);