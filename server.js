const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// For any route, serve index.html (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Frontend server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
});