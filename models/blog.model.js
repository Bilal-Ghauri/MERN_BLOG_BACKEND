const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true,
    },
    blogSlug: {
        type: String,
        required: true,
        unique: true,
    },
    blogImage: {
        type: String
    },
    blogContent: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming your user model is named 'User'
    },
});

blogSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
