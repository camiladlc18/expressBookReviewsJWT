const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(404).json({ message: "Username already exists." });
    }

    users.push({ username, password }); 

    return res.status(200).json({ message: "User registered successfully." });

});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn
    res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author

    const bookAuthor = Object.values(books).filter(book => book.author === author);

    if (bookAuthor.length > 0) {
        return res.send(bookAuthor)
    }

    else {
        return res.status(404).json({ message: "The author doesn't exists" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title

    const bookTitle = Object.values(books).filter(book => book.title === title);

    if (bookTitle.length > 0) {
        return res.send(bookTitle)
    }

    else {
        return res.status(404).json({ message: "The author doesn't exists" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
