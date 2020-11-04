// Import Libraries
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Use .env
require('dotenv').config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB')
);

// JSON
app.use(express.json());

// CORS
const cors = require('cors');
app.use(cors({credentials: true}));

// Routes
app.get('/', (req, res) => res.send('Backend Server'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/products', require('./routes/products'));
app.use('/api/transactions', require('./routes/transactions'));
    
// Start Server
app.listen(3000, () => console.log(`Server Started`))
