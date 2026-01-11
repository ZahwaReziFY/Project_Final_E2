const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

/* ===================== DATABASE ===================== */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cinelog_db'
});

db.connect(err => {
    if (err) console.log('❌ Database error:', err);
    else console.log('✅ Database connected');
});

/* ===================== AUTH MIDDLEWARE ===================== */
function isLogin(req, res, next) {
    if (!req.session.user_id) return res.redirect('/login');
    next();
}

/* ===================== LOGIN ===================== */
// '/' redirect ke login
router.get('/', (req, res) => res.redirect('/login'));

// render index.ejs sebagai halaman login
router.get('/login', (req, res) => {
    res.render('index', { error: null });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT id FROM users WHERE username=? AND password=?`;
    db.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        if (result.length === 0) return res.render('index', { error: 'Username atau password salah' });
        req.session.user_id = result[0].id;
        res.redirect('/home');
    });
});

/* ===================== SIGNUP ===================== */
router.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const check = `SELECT id FROM users WHERE username=?`;
    db.query(check, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) return res.render('signup', { error: 'Username sudah digunakan' });
        const insert = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.query(insert, [username, password], err => {
            if (err) throw err;
            res.redirect('/login');
        });
    });
});

/* ===================== HOME ===================== */
router.get('/home', isLogin, (req, res) => {
    const sql = `SELECT movies.*, categories.genre_name 
                 FROM movies 
                 JOIN categories ON movies.category_id = categories.id 
                 WHERE user_id = ?`;
    db.query(sql, [req.session.user_id], (err, result) => {
        if (err) throw err;
        res.render('home', { movies: result });
    });
});

/* ===================== ADD MOVIE ===================== */
router.get('/add-movie', isLogin, (req, res) => {
    const sql = `SELECT * FROM categories`;
    db.query(sql, (err, categories) => {
        if (err) throw err;
        res.render('movies', { categories });
    });
});

router.post('/movies', isLogin, (req, res) => {
    const { title, year, rating, category_id, status } = req.body;
    const user_id = req.session.user_id;
    const sql = `INSERT INTO movies (title, year, rating, status, user_id, category_id) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [title, year, rating, status, user_id, category_id], err => {
        if (err) throw err;
        res.redirect('/home');
    });
});

//EDIT
router.get('/edit-movie/:id', isLogin, (req, res) => {
     const sql = `SELECT * FROM movies WHERE id=? AND user_id=?`;

  db.query(sql, [req.params.id, req.session.user_id], (err, result) => {
    if (result.length === 0) return res.redirect('/home');
    res.render('edit_movie', { movie: result[0] });
  });
});

router.post('/update-movie/:id', isLogin, (req, res) => {
  const { title, year, rating, status, category_id } = req.body;

  const sql = `
    UPDATE movies SET
    title=?, year=?, rating=?, status=?, category_id=?
    WHERE id=? AND user_id=?
  `;

  db.query(
    sql,
    [
      title,
      year,
      rating,
      status,
      category_id,
      req.params.id,
      req.session.user_id
    ],
    err => {
      if (err) throw err;
      res.redirect('/home');
    }
  );
});


//DELETE
router.get('/delete-movie/:id', isLogin, (req, res) => {
  const sql = `DELETE FROM movies WHERE id=? AND user_id=?`;

  db.query(sql, [req.params.id, req.session.user_id], err => {
    if (err) throw err;
    res.redirect('/home');
  });
});

/* ===================== LOGOUT ===================== */
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.log('Logout error:', err);
        res.redirect('/login');
    });
});

module.exports = router;
