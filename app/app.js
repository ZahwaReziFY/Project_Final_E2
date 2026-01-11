const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'cinelog_secret',
  resave: false,
  saveUninitialized: true
}));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// server
app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
