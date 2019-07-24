const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Connect to database
connectDB();

// initialize middleware for body parser
app.use(express.json({extended: false}));

app.get('/', (req, res) => {
    res.send('API Running');
})

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log('Listening on port ', + PORT));