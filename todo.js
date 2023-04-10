// Required modules
const express = require('express');
const { verifyToken } = require('./login');
const router = express.Router();

// Set up the data
let todoList = [];

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
// Filter the response to only show the owner's todo
router.get('/', (req, res) => {
    const filteredList = todoList.filter(item => item.owner === req.user.username);
    res.render('index', { todoList: filteredList });
});

// Get a single todo item by ID
// Request param will specify the item ID - /api/todo/1
router.get('/:id', (req, res) => {
    //console.log(req.params.id);
    //console.log(id);
    const id = parseInt(req.params.id);

    const item = todoList.find(item => item.id === id && item.owner === req.user.username);
    if (!item) {
      return res.status(404).json({ message: `Todo item with ID ${id} not found` });
    }
    res.json(item);
});
  
// Route to add a new todo
// Post the add the response redirects to / index page
// Each element has the todo description and a status also
// Default status is not started
router.post('/add', (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const id = todoList.length + 1;
    const newItem = { id, title, status: 'not started', owner: req.user.username };
    todoList.push(newItem);
    res.json(newItem);
});


// Route to delete a todo
// request param will specify the id - /api/todo/delete/1
router.post('/delete/:id', (req, res) => {
    //console.log(req.params);
    const id = parseInt(req.params.id);

    //Check owner of the tooken and task
    const item = validateOwnerAndGetItem(req, id);
    if (!item) {
      return;
    }

    todoList.splice(index, 1);
    res.json({ message: `Todo item with ID ${id} deleted` });
});


// Route to update a todo status
// request param will specify the id - PUT** - /api/1
router.put('/:id', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);

    //Validate owner and allow update of item
    const item = validateOwnerAndGetItem(req, id);
    if (!item) {
      return;
    }

    const { title, status } = req.body;
    if (title) {
      item.title = title;
    }
    if (status) {
      item.status = status;
    }
    res.json(item);
});

function validateOwnerAndGetItem(req, id) {
    const tokenUsername = req.user.username;

    const item = todoList.find(item => item.id === id && item.owner === req.user.username);
    if (!item) {
      return res.status(404).json({ message: `Todo item with ID ${id} not found` });
    }

    //Check owner of the tooken and task
    if (item.owner !== tokenUsername) {
      return res.status(403).json({ message: `User is not authorized to modify this todo item` });
    }

    return item;
}

module.exports = router;