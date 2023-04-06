const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: String,
    time: Date,
    username: {
        type: String,
        ref: 'User'
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

module.exports = mongoose.model('Comment', commentSchema);
