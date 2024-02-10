const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    profilePicture: {
        type: String, // You might store the image URL or path here
    },
    // blogs: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Blog', // Assuming your blog model is named 'Blog'
    // }],
});

// Middleware to update 'updatedAt' field before saving
userSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;