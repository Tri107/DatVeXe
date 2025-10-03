const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Test 
app.get('/', (req, res) => {
  res.json({ message: "API đặt vé xe đang chạy!" });
});

// Import routes 
const routes = require('./routes/api');   
app.use('/api', routes);             

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server chạy tại http://localhost:${PORT}`);
});
