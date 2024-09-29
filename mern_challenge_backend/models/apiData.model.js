const mongoose = require('mongoose');

const APIDataSchema = mongoose.Schema({
    "id": {
        type: String,
        required: true,
    },
    "title": {
        type: String,
        required: true,
        trim: true,
    },
    "price": {
        type: Number,
        required: true,
        min: [0, 'Price must be min 0'],
    },
    "description": {
        type: String,
        trim: true,
    },
    "category": {
        type: String,
        trim: true,
    },
    "image": {
        type: String,
    },
    "sold": {
        type: Boolean,
        required: true,
    },
    "dateOfSale": {
        type: String,
        required: true,
    },
    "month": {
        type: Number,
        required:true,
        min: 1,
        max: 12,
    }
})

module.exports = mongoose.model('APIData', APIDataSchema);