const bcrypt = require('bcrypt'); 
const pool = require('../config/dbconfig');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('All fields (username, email, password) are required.');
    }

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const insertUserQuery = `
            INSERT INTO users_tbl (username, email, password_hash)
            VALUES ($1, $2, $3) RETURNING user_id, username, email, created_at;
        `;

        const result = await pool.query(insertUserQuery, [username, email, passwordHash]);
        
        res.status(201).json({
            message: 'User registered successfully!',
            user: result.rows[0]
        });
    } catch (err) {
        console.error('Error registering user:', err.message);

        if (err.code === '23505') {
            return res.status(409).send('Username or email already exists.');
        }

        res.status(500).json({ message: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    try {
        const getUserQuery = `SELECT * FROM users_tbl WHERE username = $1`;
        const userResult = await pool.query(getUserQuery, [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).send('No such user.');
        }

        const user = userResult.rows[0];
        
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (passwordMatch) {
            return res.status(200).send('Logged in successfully!!');
        } else {
            return res.status(401).send('Incorrect password.');
        }
    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    registerUser,
    loginUser
}
