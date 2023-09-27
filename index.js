const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./dbconnection'); // Import the database connection
const apiRoutes = require('./api');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use the API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());

module.exports = app;