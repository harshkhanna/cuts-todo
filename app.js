// Required modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

//Split todo into a separate module
const todo = require('./todo');

//Split login into a separate module
const login = require('./login');

//Split posts into a separate module
const posts = require('./posts');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Set up a connection to the MongoDB database
mongoose.connect('mongodb://localhost/cuts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB successfully');
});

// Routes for user authentication
app.use('/api', login.router);

// Middleware to verify JWT token for todo routes and posts routes
app.use('/api/todo', login.verifyToken);
app.use('/api/posts', login.verifyToken);

// Routes for todo list
app.use('/api/todo', todo);

// Routes for posts list
app.use('/api/posts', posts);


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
