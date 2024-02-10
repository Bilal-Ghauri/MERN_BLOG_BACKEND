const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');
const Blog = require('../../models/blog.model');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/blogs', authMiddleware, [
    check('blogTitle').not().isEmpty().withMessage('Blog title is required'),
    check('blogSlug').not().isEmpty().withMessage('Blog slug is required'),
    check('blogContent').not().isEmpty().withMessage('Blog content is required'),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { blogTitle, blogSlug, blogImage, blogContent, tags } = req.body;

    try {
        let findBlog = await Blog.findOne({ blogSlug })
        if (findBlog) {
            return res.status(400).json({ msg: "Blog slug should be unique" })
        }
        const newBlog = new Blog({
            blogTitle,
            blogSlug,
            blogImage,
            blogContent,
            tags,
            author: req.userId, // Assuming you attach the user ID to the request object in the auth middleware
        });

        // Save the blog post to the database
        await newBlog.save();
        res.json(newBlog);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'name email');
        res.json(blogs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/blogs/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ blogSlug: req.params.slug }).populate('author', 'name email');
        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        res.json(blog);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Update a blog post by ID
router.put('/blogs/:id', [
    // Validation using express-validator
    check('blogTitle').not().isEmpty().withMessage('Blog title is required'),
    check('blogSlug').not().isEmpty().withMessage('Blog slug is required'),
    check('blogContent').not().isEmpty().withMessage('Blog content is required'),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { blogTitle, blogSlug, blogImage, blogContent, tags } = req.body;

    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }

        // Update the blog post fields
        blog.blogTitle = blogTitle;
        blog.blogSlug = blogSlug;
        blog.blogImage = blogImage;
        blog.blogContent = blogContent;
        blog.tags = tags;

        // Save the updated blog post to the database
        await blog.save();

        res.json(blog);
    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog post not found' });
        }

        res.status(500).send('Server Error');
    }
});


router.post('/add/image', async (req, res) => {
    const { blogId, blogImage } = req.body;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        blog.blogImage = blogImage;
        await blog.save();
        res.json(blog);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        res.status(500).send('Server Error');
    }
});

router.delete('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        if (blog.author.toString() !== req.userId) {
            return res.status(401).json({ msg: 'Not authorized to delete this blog post' });
        }
        await blog.remove();
        res.json({ msg: 'Blog post deleted successfully' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router