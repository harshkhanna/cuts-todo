Libraries required
1. express: This is a popular Node.js framework that provides a set of tools for creating web applications and APIs.

2. body-parser: This is a middleware for parsing HTTP request bodies in Node.js. It is used here to parse incoming request bodies that contain form data.

3. ejs: This is a template engine for Node.js that allows you to embed JavaScript code in your HTML templates.

4. jsonwebtoken : JWT validation.  library for creating and verifying JSON Web Tokens (JWTs)

5. fs : "file system". The fs module is used for interacting with the file system

6. mocha & chai & jest - This is for testing


Modules
1. app.js  - Main app
2. todo.js - ToDo sub-Module, launched on URL prepended with /todo/
3. login.js - Login module for validating the user/passwords and issuing JWT tokens
4. 


APIs organization
Used the prefix /api for all our routes. This is for organizing API routes and avoiding collisions with other routes in application. 
So the login routes will be available at /api/login, and the todo routes will be available at /api/todo.


ToDo APIs - index.ejs has a sample implementation of the 3 APIs below
Used the prefix /toto for all our todo APIs. The todo routes will be available at /api/todo.
1. /api/todo            -> Get all available ToDo's. Also has a input box to add a new ToDo
2. /api/todo/delete/?i  -> Delete the i'th ToDo. This is a POST command via POSTMAN or API
3. /api/todo/add/       -> Add a new ToDo using the newTodo text element in the form... This is a POST command via POSTMAN or API


Launch
    Installs
    1. npm install express
    2. npm install body-parser
    3. npm install ejs
    4. npm install jsonwebtoken
    5. npm install fs
    6. npm install mocha chai jest jest-mock --save-dev

    Run
    1. To run this code, you can start the server by running the app.js file with the command node app.js.
    2. the todo list will be accessible at http://localhost:3000/api/todo/.

    Tests
    Launch the app - node app.js
    Launch the tests - npm test