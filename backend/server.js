const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database & Start Server
connectDB().finally(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (0.0.0.0)`);
  });
});
