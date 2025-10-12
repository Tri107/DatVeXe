const express = require('express');
const cors = require('cors');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

//  CORS phải bật credentials để gửi cookie qua trình duyệt/axios/fetch
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', // FE
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

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
app.use('/admin', require('./routes/Admin/index'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server chạy tại http://localhost:${PORT}`);
});
