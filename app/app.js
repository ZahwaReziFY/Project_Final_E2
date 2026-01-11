const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const routes = require('./routes/index')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'cinelog_secret',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', routes);

const PORT = process.env.APP_PORT || 2585;
app.listen(PORT, () => {
  console.log(`🚀 App running on port ${PORT}`);
});
