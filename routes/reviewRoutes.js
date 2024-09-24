const express = require('express');
const { postReview, getReviewsByISBN, getReviewsByUserId, deleteReview } = require('../controllers/reviewsController');

const reviewRouter = express.Router();

reviewRouter.post('/postReview', postReview );
reviewRouter.get('/book/:isbn', getReviewsByISBN);
reviewRouter.get('/getReview/:user_id', getReviewsByUserId);
reviewRouter.delete('/delete/:review_id', deleteReview);


module.exports = reviewRouter;