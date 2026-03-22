const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./src/routes/index');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Veterinary System API is running.');
});

const PORT = process.env.PORT || 5005;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
