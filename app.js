// Required modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//Split todo into a separate module
const todo = require('./todo');

//Split login into a separate module
const login = require('./login');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Routes for user authentication
app.use('/api', login.router);

// Middleware to verify JWT token for todo routes
app.use('/api/todo', login.verifyToken);

// Routes for todo list
app.use('/api/todo', todo);

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
