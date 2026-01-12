const express = require('express');
const router = express.Router();
const db = require("../config/database");


/* ================= AUTH ================= */
function isLogin(req, res, next) {
  if (!req.session.user_id) return res.redirect('/login');
  next();
}

/* ================= ROUTES ================= */
router.get('/', (req, res) => res.redirect('/login'));

router.get('/login', (req, res) => {
  res.render('index', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT id FROM users WHERE username=? AND password=?`;

  db.query(sql, [username, password], (err, result) => {
    if (err) throw err;
    if (result.length === 0)
      return res.render('index', { error: 'Username atau password salah' });

    req.session.user_id = result[0].id;
    res.redirect('/home');
  });
});

router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const check = `SELECT id FROM users WHERE username=?`;

  db.query(check, [username], (err, result) => {
    if (err) throw err;
    if (result.length > 0)
      return res.render('signup', { error: 'Username sudah digunakan' });

    const insert = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.query(insert, [username, password], err => {
      if (err) throw err;
      res.redirect('/login');
    });
  });
});

router.get('/home', isLogin, (req, res) => {
  const sql = `
    SELECT movies.*, categories.genre_name
    FROM movies
    JOIN categories ON movies.category_id = categories.id
    WHERE user_id = ?
  `;
  db.query(sql, [req.session.user_id], (err, result) => {
    if (err) throw err;
    res.render('home', { movies: result });
  });
});

router.get('/add-movie', isLogin, (req, res) => {
  db.query(`SELECT * FROM categories`, (err, categories) => {
    if (err) throw err;
    res.render('movies', { categories });
  });
});

router.post('/movies', isLogin, (req, res) => {
  const { title, year, rating, category_id, status } = req.body;
  const sql = `
    INSERT INTO movies (title, year, rating, status, user_id, category_id)
    VALUES (?,?,?,?,?,?)
  `;

  db.query(sql,
    [title, year, rating, status, req.session.user_id, category_id],
    err => {
      if (err) throw err;
      res.redirect('/home');
    }
  );
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
