// server.js
const express = require('express');
const cors = require('cors');

const promptsRoutes = require('./routes/prompts');
const rulesRoutes = require('./routes/rules');
const app = express(); 

// Middleware 
app.use(cors()); app.use(express.json());
// Routes
app.use('/api/prompts', promptsRoutes);
app.use('/api/rules', rulesRoutes);
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
//Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));