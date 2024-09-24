const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bookRouter = require('./routes/booksRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/bookshop', bookRouter);
app.use('/user', userRouter);
app.use('/review', reviewRouter);

app.listen(process.env.LOCALPORT, () => {
    console.log(`Server is up and running on port ${process.env.LOCALPORT}`);
});