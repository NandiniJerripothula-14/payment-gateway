require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', apiRoutes);

// Initialize database and start server
async function start() {
  try {
    await initializeDatabase();
    console.log('Database initialized');

    app.listen(PORT, () => {
      console.log(`Payment Gateway API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
