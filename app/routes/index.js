const express = require("express");
const mysql = require("mysql2");
const router = express.Router();

/* ================= DATABASE ================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cinelog_db"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("DB Connected");
});

/* ================= AUTH ================= */
function isLogin(req, res, next) {
  if (!req.session.user_id) return res.redirect("/");
  next();
}

/* ================= LOGIN ================= */
router.get("/", (req, res) => {
  res.render("index");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT id FROM users WHERE username=? AND password=?`;
  db.query(sql, [username, password], (err, result) => {
    if (result.length === 0) {
      return res.render("index", { error: "Login gagal" });
    }
    req.session.user_id = result[0].id;
    res.redirect("/home");
  });
});

/* ================= SIGNUP ================= */
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

/* ================= HOME ================= */
router.get("/home", isLogin, (req, res) => {
  const sql = `
    SELECT movies.*, categories.genre_name 
    FROM movies 
    JOIN categories ON movies.category_id = categories.id
    WHERE user_id=?
  `;
  db.query(sql, [req.session.user_id], (err, movies) => {
    res.render("home", { movies });
  });
});

/* ================= ADD MOVIE ================= */
router.get("/add-movie", isLogin, (req, res) => {
  res.render("movies");
});

router.post("/movies", isLogin, (req, res) => {
  const { title, year, rating, category_id, status } = req.body;
  const sql = `
    INSERT INTO movies (title,year,rating,category_id,user_id,status)
    VALUES (?,?,?,?,?,?)
  `;
  db.query(
    sql,
    [title, year, rating, category_id, req.session.user_id, status],
    () => res.redirect("/home")
  );
});

/* ================= EDIT MOVIE ================= */
router.get("/movies/:id/edit", isLogin, (req, res) => {
  const sql = `SELECT * FROM movies WHERE id=?`;
  db.query(sql, [req.params.id], (err, movie) => {
    res.render("edit-movie", { movie: movie[0] });
  });
});

router.post("/movies/:id/edit", isLogin, (req, res) => {
  const { title, year, rating, status } = req.body;
  const sql = `
    UPDATE movies SET title=?, year=?, rating=?, status=?
    WHERE id=? AND user_id=?
  `;
  db.query(
    sql,
    [title, year, rating, status, req.params.id, req.session.user_id],
    () => res.redirect("/home")
  );
});

/* ================= DELETE MOVIE ================= */
router.post("/movies/:id/delete", isLogin, (req, res) => {
  const sql = `DELETE FROM movies WHERE id=? AND user_id=?`;
  db.query(sql, [req.params.id, req.session.user_id], () => {
    res.redirect("/home");
  });
});

/* ================= LOGOUT ================= */
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;