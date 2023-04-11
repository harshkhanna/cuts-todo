// Required modules
const express = require('express');
const mongoose = require('mongoose');
const { verifyToken } = require('./login');

// Define post schema
// Define post schema if it doesn't exist
const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
        title: { type: String, required: true },
        body: { type: String, required: true },
        author: { type: String, required: true },
        date: { type: Date, default: Date.now },
        comments: [{
          text: { type: String, required: true },
          author: { type: String, required: true },
          date: { type: Date, default: Date.now }
        }]
  }));
  

// Create express router
const router = express.Router();

// Route to get all posts
router.get('/', async(req, res) => {
  try {
    const postsList = await Post.find();
    res.json(postsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add a new post
router.post('/add', verifyToken, async(req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required' });
  }
  const author = req.user.username;
  const newPost = new Post({ title, body, author, comments: [] });
  try {
    newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }  
});

// Route to get a single post by ID
router.get('/:id', async(req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
        return res.status(404).json({ message: `Post with ID ${id} not found` });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add a comment to a post
router.post('/:id/comments', verifyToken, async(req, res) => {
    const id = req.params.id;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    const author = req.user.username;
    const comment = { text, author };
    
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: `Post with ID ${id} not found` });
      }
      post.comments.push(comment);
      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
});

// Export router
module.exports = router;
