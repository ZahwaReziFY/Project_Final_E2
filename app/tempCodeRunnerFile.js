const express = require("express");
const bodyParser = require("body-parser");
const mainRoutes = require("./routes/index");
const app = express();
const PORT = process.env.APP_PORT || 3000;

// --- MIDDLEWARE ---
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//routing
app.use('/',indexRoutes);

//Menjalankan Server

app.listen(PORT,()=>{
    console.log('Server running at http://localhost:${PORT}');
});