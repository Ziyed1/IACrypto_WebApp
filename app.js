const express = require('express');
const cors = require('cors'); // Import du package CORS
const app = express();
const port = 3000;

// Active le CORS pour tous les domaines
app.use(cors());

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});