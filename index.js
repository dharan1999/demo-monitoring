const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html')); // Update this line
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
