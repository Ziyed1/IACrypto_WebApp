// app.js
const express = require('express');
const app = express();
const port = 3000;

// Route simple pour tester
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
