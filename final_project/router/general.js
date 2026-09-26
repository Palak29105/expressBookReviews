const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    users.push({
      username: username,
      password: password
    });

    return res.status(201).json({
      message: "User successfully registered. Now you can login"
    });
  }

  return res.status(400).json({
    message: "Unable to register user"
  });
});


// Get all books
public_users.get('/', function (req, res) {
  return res.json(books);
});


// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');

    const isbn = req.params.isbn;

    if (response.data[isbn]) {
      return res.json(response.data[isbn]);
    }

    return res.status(404).json({
      message: "Book not found"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');

    const author = req.params.author;
    const result = {};

    for (let key in response.data) {
      if (
        response.data[key].author.toLowerCase() ===
        author.toLowerCase()
      ) {
        result[key] = response.data[key];
      }
    }

    return res.json(result);

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');

    const title = req.params.title;
    const result = {};

    for (let key in response.data) {
      if (
        response.data[key].title.toLowerCase() ===
        title.toLowerCase()
      ) {
        result[key] = response.data[key];
      }
    }

    return res.json(result);

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


module.exports.general = public_users;
