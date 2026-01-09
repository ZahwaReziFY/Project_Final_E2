-- ===============================
-- DATABASE: CINELOG
-- ===============================

CREATE DATABASE IF NOT EXISTS cinelog_db;
USE cinelog_db;

-- ===============================
-- TABEL: users
-- ===============================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- ===============================
-- TABEL: categories
-- ===============================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(50) NOT NULL
);

-- ===============================
-- TABEL: movies
-- ===============================
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    year INT NOT NULL,
    rating DECIMAL(2,1),
    category_id INT,
    user_id INT,
    status VARCHAR(50),
    image VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===============================
-- DATA AWAL (DUMMY DATA)
-- ===============================

INSERT INTO users (username, password) VALUES
('fadlan', 'password123');

INSERT INTO categories (genre_name) VALUES
('Action'),
('Horror'),
('Comedy'),
('Drama');

INSERT INTO movies (title, year, rating, category_id, user_id, status, image) VALUES
('Interstellar', 2014, 4.8, 1, 1, 'Sudah Ditonton', 'interstellar.jpg'),
('The Conjuring', 2013, NULL, 2, 1, 'Rencana Nonton', 'conjuring.jpg');