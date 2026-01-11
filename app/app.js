const express = require('express');
const session = require('express-session');
const router = require('./routes/index');
const app = express();

// VIEW ENGINE
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SESSION
app.use(session({
    secret: 'secretkey123',
    resave: false,
    saveUninitialized: false
}));

// ROUTES
app.use('/', router);

// START SERVER
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
