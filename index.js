const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

// Connect to DB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECT, () => console.log("Connected to DB"));


// Middlewares
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => console.log("Server up and running"));