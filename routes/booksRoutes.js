const express = require('express');
const { createBooksList, getAllBooks, getByISBN, getByAuthor, getByTitle, deleteBook, updateBookDetails } = require('../controllers/booksController');

const bookRouter = express.Router();

bookRouter.post('/addBooks', createBooksList);
bookRouter.get('/allBooks', getAllBooks);
bookRouter.get('/isbn/:isbn', getByISBN);
bookRouter.get('/author/:author', getByAuthor);
bookRouter.get('/title/:title', getByTitle);
bookRouter.delete('/delBook/:isbn', deleteBook);
bookRouter.put('/updateBook/:isbn', updateBookDetails);

module.exports = bookRouter;