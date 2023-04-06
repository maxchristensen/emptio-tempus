const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productName: String,
    description: String,
    price: String,
    category: String,
    condition: String,
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    comment: [],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Product', productSchema)