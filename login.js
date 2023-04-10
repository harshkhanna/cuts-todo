const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fs = require('fs');

// Read user credentials from file
const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

//Login function for tests
function loginTest(username, password) {
  // Check if user exists and password is correct
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return null;
  }

  // Create JWT token
  const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });

  return token;
}

// Login route
router.post('/login', (req, res) => {
  // Get username and password from request body
  const { username, password } = req.body;
  //console.log(req.body);

  // Check if user exists and password is correct
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    const validUsernames = users.map(user => user.username);
    const validPasswords = users.map(user => user.password);
    //console.log(`Invalid username or password. Valid usernames are: ${validUsernames.join(', ')}, ${validPasswords.join(', ')}`);
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create JWT token
  const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });

  // Send JWT token as response
  res.json({ token });
});


// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const decodedToken = jwt.verify(token, 'secret');
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
}

module.exports = {
  router,
  verifyToken,
  loginTest
};
