// Required modules
const express = require('express');
const { verifyToken } = require('./login');
const mongoose = require('mongoose');
const router = express.Router();

// Define the schema for the todoList document
// Create the model for the todoList document
const Todo = mongoose.models.Todo || mongoose.model('Todo', new mongoose.Schema({
  id: Number,
  title: String,
  status: String,
  owner: String,
}));

  // Sample todo list data
  // let todoList = [
  //     {
  //       id: 1,
  //       title: 'Buy groceries',
  //       status: 'in progress',
  //       owner: 'john'
  //     },
  //     {
  //       id: 2,
  //       title: 'Walk the dog',
  //       status: 'not started',
  //       owner: 'jane'
  //     }
  //   ];

// Route to show the todo list
router.get('/', async (req, res) => {
  try {
    const todoList = await Todo.find();
    res.render('index', { todoList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single todo item by ID
// Request param will specify the item ID - /api/todo/1
router.get('/:id', async (req, res) => {
    //console.log(req.params.id);
    //console.log(id);
    const id = parseInt(req.params.id);

    try {
      const item = await Todo.findOne({ id });
      if (!item) {
        return res.status(404).json({ message: `Todo item with ID ${id} not found` });
      }
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
  
// Route to add a new todo
// Post the add the response redirects to / index page
// Each element has the todo description and a status also
// Default status is not started
router.post('/add', async (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const id = await Todo.countDocuments({}) + 1;
    const newItem = new Todo({ id, title, status: 'not started', owner: req.user.username });
    try {
      await newItem.save();
      res.json(newItem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }    
});


// Route to delete a todo
// request param will specify the id - /api/todo/delete/1
router.post('/delete/:id', verifyToken, async (req, res) => {
  //console.log(req.params);
  const id = parseInt(req.params.id);

  // Check owner of the token and task
  const item = await Todo.findOne({ id, owner: req.user.username });
  if (!item) {
    return res.status(404).json({ message: `Todo item with ID ${id} not found` });
  }

  //Check owner of the tooken and task
  const tokenUsername = req.user.username;
  if (item.owner !== tokenUsername) {
    return res.status(403).json({ message: `User is not authorized to modify this todo item` });
  }

  try {
    await Todo.deleteOne({ id, owner: req.user.username });
    res.json({ message: `Todo item with ID ${id} deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to update a todo status
// request param will specify the id - PUT** - /api/1
router.put('/:id', verifyToken, async(req, res) => {
    const id = parseInt(req.params.id);

    // Check owner of the token and task
    const item = await Todo.findOne({ id, owner: req.user.username });
    if (!item) {
      return res.status(404).json({ message: `Todo item with ID ${id} not found` });
    }

    //Check owner of the tooken and task
    const tokenUsername = req.user.username;
    if (item.owner !== tokenUsername) {
      return res.status(403).json({ message: `User is not authorized to modify this todo item` });
    }

    const { title, status } = req.body;
    if (title) {
      item.title = title;
    }
    if (status) {
      item.status = status;
    }

    try {
      await item.save();
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }   
});


module.exports = router;