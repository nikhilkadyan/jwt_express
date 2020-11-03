// Import Libraries
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
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
app.use(cors());
// const corsOptions = { origin: 'https://nikhilkadyan.com', optionsSuccessStatus: 200 }
// app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => res.send('Backend Server'));

// Route Middlewares
app.use('/api/auth', require('./routes/auth'));
    
// Start Server
app.listen(3000, () => console.log(`Server Started`))
