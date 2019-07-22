// Create connection with the database
const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {useNewUrlParser: true, useCreateIndex: true});
        console.log('Connected to database');
    } catch (err) {
        console.log('Error connecting to database');
        process.exit(1);
    }
}

module.exports = connectDB;