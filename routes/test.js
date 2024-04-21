const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Book = require('../models/Book'); // Assuming you have a Book model
const User = require('../models/User'); // Assuming you have a User model

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

// Route to get list of published blogs (paginated, searchable, orderable)
router.get('/blogs', async (req, res) => {
    try {
        const { page = 1, limit = 20, author, title, tags, sortBy, sortOrder } = req.query;

        let query = { state: 'published' };

        if (author) query.author = author;
        if (title) query.title = { $regex: title, $options: 'i' };
        if (tags) query.tags = { $in: tags.split(',') };

        const sort = {};
        if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const blogs = await Book.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Book.countDocuments(query);
        
        res.json({
            blogs,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalBlogs: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a single blog
router.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Book.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        
        // Update read count
        blog.read_count += 1;
        await blog.save();

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a blog (only accessible by logged in users)
router.post('/blogs', authenticateToken, async (req, res) => {
    try {
        const { title, author, description, tags, body } = req.body;

        const blog = new Book({
            title,
            author,
            description,
            tags,
            body,
            state: 'draft', // New blog is initially in draft state
            read_count: 0,
            reading_time: calculateReadingTime(body), // Custom function to calculate reading time
            timestamp: new Date()
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to update a blog (only accessible by owner of the blog)
router.patch('/blogs/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, description, tags, body, state } = req.body;

        const blog = await Book.findById(id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Check if the logged-in user is the owner of the blog
        if (blog.author !== req.user._id) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this blog' });
        }

        // Update blog fields
        blog.title = title || blog.title;
        blog.author = author || blog.author;
        blog.description = description || blog.description;
        blog.tags = tags || blog.tags;
        blog.body = body || blog.body;
        blog.state = state || blog.state;

        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a blog (only accessible by owner of the blog)
router.delete('/blogs/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Book.findById(id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Check if the logged-in user is the owner of the blog
        if (blog.author !== req.user._id) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this blog' });
        }

        await blog.remove();
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
