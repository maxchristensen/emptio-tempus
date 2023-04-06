const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullname: String,
    username: String,
    email: String,
    password: String,
    about: String
})

module.exports = mongoose.model('User', userSchema)