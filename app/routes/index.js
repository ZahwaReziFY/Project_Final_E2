const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');

const app = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// SESSION
// ===============================
app.use(
    session({
        secret: 'cinelog_secret',
        resave: false,
        saveUninitialized: true
    })
);

// ===============================
// KONEKSI DATABASE
// ===============================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'fadlan',
    password: 'password123',
    database: 'cinelog'
});

db.connect(err => {
    if (err) {
        console.error('DB Error:', err);
    } else {
        console.log('Database connected');
    }
});

// ===============================
// MIDDLEWARE AUTH
// ===============================
function isLogin(req, res, next) {
    if (!req.session.user_id) {
        return res.status(401).json({ message: 'Silakan login dulu' });
    }
    next();
}

// ===============================
// ROUTE DEFAULT
// ===============================
app.get('/', (req, res) => {
    res.render("index")
});

// ===============================
// SIGN UP
// ===============================
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    const checkSql = `SELECT id FROM users WHERE username = ?`;
    db.query(checkSql, [username], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            return res.status(400).json({ message: 'Username sudah digunakan' });
        }
        const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(insertSql, [username, password], (err) => {
            if (err) return res.status(500).json(err);
            res.redirect('/login');
        });
    });
});



// ===============================
// LOGIN
// ===============================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = `
        SELECT id, username 
        FROM users 
        WHERE username = ? AND password = ?
    `;

    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            req.session.user_id = result[0].id;
            res.redirect("/movies");
        } else {
            res.send(
                <script>
                    alert('Username atau password salah');
                    window.location.href = '/';
                </script>);
        }
    });
});

// ===============================
// LOGOUT
// ===============================
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout berhasil' });
        }
        res.redirect('/');
    });
});

// ===============================
// READ MOVIES (USER LOGIN)
// ===============================
app.get('/movies', isLogin, (req, res) => {
    const user_id = req.session.user_id;

    const sql = `
        SELECT movies.id, title, year, rating, status, genre_name
        FROM movies
        JOIN categories ON movies.category_id = categories.id
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.render("home", movies = result);
    });
});

// ===============================
// CREATE MOVIE
// ===============================
app.get('/add-movie', isLogin, (req, res) => {
    res.redirect("/movies")
})

app.post('/movies', isLogin, (req, res) => {
    const { title, year, rating, category_id, status } = req.body;
    const user_id = req.session.user_id;

    const sql = `
        INSERT INTO movies
        (title, year, rating, category_id, user_id, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, year, rating, category_id, user_id, status],
        err => {
            if (err) return res.status(500).json(err);
            res.render("home", { movies: result});
        }
    );
});

// ===============================
// UPDATE MOVIE
// ===============================
app.put('/movies/:id', isLogin, (req, res) => {
    const { status, rating } = req.body;
    const movie_id = req.params.id;
    const user_id = req.session.user_id;

    const sql = `
        UPDATE movies 
        SET status = ?, rating = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [status, rating, movie_id, user_id], err => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Film berhasil diupdate' });
    });
});

// ===============================
// DELETE MOVIE
// ===============================
app.delete('/movies/:id', isLogin, (req, res) => {
    const movie_id = req.params.id;
    const user_id = req.session.user_id;

    const sql = `
        DELETE FROM movies
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [movie_id, user_id], err => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Film berhasil dihapus' });
    });
});

module.exports = app
