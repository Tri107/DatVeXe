const express = require('express');
const cors = require('cors');
const session = require('express-session');

require('dotenv').config();

const app = express();



//  CORS phải bật credentials để gửi cookie qua trình duyệt/axios/fetch
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // FE
  credentials: true
}));

app.use(express.json());

//  Session middleware
app.use(session({

  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',    
    secure: false,      
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày
  }
}));

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
