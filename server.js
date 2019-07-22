const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Connect to database
connectDB();

app.get('/', (req, res) => {
    res.send('API Running');
})

// Define routes
app.use('/api/users', require('./routes/api/users'));

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log('Listening on port ', + PORT));