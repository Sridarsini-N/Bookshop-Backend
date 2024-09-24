const pool = require('../config/dbconfig');

const createBooksList = async (req,res) => {

    const { isbn, title, author, price, publication_year, stock_count } = req.body;

    if(!isbn || !title || !author || !price || !publication_year || !stock_count){
        return res.status(400).send("Invalid request body");
    }

    try{

        const insertBooks = `INSERT into books_tbl(isbn, title, author, price, publication_year, stock_count ) VALUES ( $1, $2, $3, $4, $5, $6)` ;
        await pool.query(insertBooks, [ isbn, title, author, price, publication_year, stock_count]);
        res.status(201).send(`Inserted successfully!`);

    } catch(err) {
        console.error('Error inserting record:', err.message);
        res.status(501).json({ message : "Internal server error"});
    }
};

const getAllBooks = async (req,res) =>{
    try{

        const result = await pool.query('SELECT * from books_tbl');
        res.status(201).send(result.rows);

    } catch (err) {
        console.error('Error getting records:', err.message );
        res.status(501).json({ message : "Internal server error"});
    }
};

const getByISBN = async (req,res) => {
   
    try{
        const isbnId = req.params.isbn;
        const getIsbn = `SELECT * FROM books_tbl WHERE isbn = $1`;
        const result = await pool.query(getIsbn, [isbnId]);
        res.status(201).send(result.rows);
    } catch(err) {
        console.error('Error getting record:', err.message);
        res.status(501).json({ message : 'Internal server error' })
    }
};

const getByAuthor = async (req,res) =>{
    try{
        const authorName = req.params.author;
        const getAuthor = `SELECT * FROM books_tbl WHERE author = $1`
        const result = await pool.query(getAuthor, [authorName])

        if (result.rows.length === 0) {
            return res.status(404).send('No books found for the given author');
        }

        res.status(200).json(result.rows);

    } catch (err) {
        console.error('Error getting record:', err.message);
        res.status(501).json({ message : 'Internal server error' })
    }
};

const getByTitle = async (req,res) =>{
    try{
        const title = req.params.title;
        const getTitle = ` SELECT * FROM books_tbl WHERE title = $1`;
        const result = await pool.query(getTitle, [title]);

        if (result.rows.length === 0) {
            return res.status(404).send('No books found for the given author');
        }

        res.status(200).json(result.rows);
    } catch(err) {
        console.error('Error getting record:', err.message);
        res.status(501).json({ message : 'Internal server error' })
    }

};

const deleteBook = async (req,res) => {
    
    try{
    const isbn = req.params.isbn;
    const removeBook = 'DELETE FROM books_tbl WHERE isbn = $1';
    const result = await pool.query(removeBook, [isbn]);
    res.status(200).send('Deleted successfully!');
    } catch(err) {
        console.log(err);
        res.status(500).send('Error deleting record');
    }
};

const updateBookDetails = async (req, res) => {
    const { price, stock_count } = req.body;

    if (!price || !stock_count ) {
        return res.status(400).send("Invalid request body");
    }

    try{
        let updateBook = `UPDATE books_tbl SET 
        price = $1,
        stock_count = $2
        WHERE isbn = $3`;
        const isbn = req.params.isbn;
        const values = [price, stock_count, isbn];
        await pool.query(updateBook, values);
        res.status(201).json({ message : "Updated successfully!"});
       
    } catch (err){
        console.log(err.message);
        res.status(501).json({ message : "Error updating records" });
    }         
};


module.exports = {
    createBooksList,
    getAllBooks,
    getByISBN,
    getByAuthor,
    getByTitle,
    deleteBook,
    updateBookDetails
}