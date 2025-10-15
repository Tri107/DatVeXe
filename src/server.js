const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000/',
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
  res.json({ message: "API đặt vé xe đang chạy!" });
});

app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/Admin/index'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log( `Server chạy tại http://localhost:${PORT}`);
})