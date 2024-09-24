const pool = require('../config/dbconfig');

const postReview = async (req, res) => {
    const { user_id, isbn, review_text, rating } = req.body;

    if (!user_id || !isbn || !review_text || !rating) {
        return res.status(400).send('All fields (user_id, isbn, review_text, rating) are required.');
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).send('Rating must be between 1 and 5.');
    }

    try {
        const checkUserQuery = `SELECT * FROM users_tbl WHERE user_id = $1`;
        const userResult = await pool.query(checkUserQuery, [user_id]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).send('User not found.');
        }

        const checkBookQuery = `SELECT * FROM books_tbl WHERE isbn = $1`;
        const bookResult = await pool.query(checkBookQuery, [isbn]);

        if (bookResult.rows.length === 0) {
            return res.status(404).send('Book not found.');
        }

        const insertReviewQuery = `
            INSERT INTO reviews_tbl (user_id, isbn, review_text, rating)
            VALUES ($1, $2, $3, $4) RETURNING review_id, user_id, isbn, review_text, rating, created_at;
        `;
        const result = await pool.query(insertReviewQuery, [user_id, isbn, review_text, rating]);

        res.status(201).json({
            message: 'Review posted successfully!',
            review: result.rows[0]
        });
    } catch (err) {
        console.error('Error posting review:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getReviewsByISBN = async (req, res) => {
    const { isbn } = req.params;

    if (!isbn) {
        return res.status(400).send('ISBN is required.');
    }

    try {
        const getReviewsQuery = `
            SELECT r.review_id, r.review_text, r.rating, r.created_at, u.username
            FROM reviews_tbl r
            JOIN users_tbl u ON r.user_id = u.user_id
            WHERE r.isbn = $1;
        `;
        
        const result = await pool.query(getReviewsQuery, [isbn]);

        if (result.rows.length === 0) {
            return res.status(404).send('No reviews found for the given ISBN.');
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving reviews:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getReviewsByUserId = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).send('User ID is required.');
    }

    try {
        
        const getUserReviewsQuery = `
            SELECT r.review_id, r.review_text, r.rating, r.created_at, b.title AS book_title, b.isbn
            FROM reviews_tbl r
            JOIN books_tbl b ON r.isbn = b.isbn
            WHERE r.user_id = $1;
        `;

        const result = await pool.query(getUserReviewsQuery, [user_id]);

        if (result.rows.length === 0) {
            return res.status(404).send('No reviews found for the given user.');
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving reviews:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteReview = async (req, res) => {
    const { review_id } = req.params; 
    const { user_id } = req.body; 

    if (!review_id || !user_id) {
        return res.status(400).send("Review ID and User ID are required.");
    }

    try {
        const checkReviewQuery = `SELECT * FROM reviews_tbl WHERE review_id = $1 AND user_id = $2`;
        const reviewResult = await pool.query(checkReviewQuery, [review_id, user_id]);

        if (reviewResult.rows.length === 0) {
            return res.status(404).send('Review not found or you do not have permission to delete this review.');
        }

        const deleteReviewQuery = `DELETE FROM reviews_tbl WHERE review_id = $1 AND user_id = $2`;
        await pool.query(deleteReviewQuery, [review_id, user_id]);

        res.status(200).send('Review deleted successfully.');
    } catch (err) {
        console.error('Error deleting review:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    postReview,
    getReviewsByISBN,
    getReviewsByUserId,
    deleteReview
}
