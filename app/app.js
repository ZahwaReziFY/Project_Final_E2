const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const routes = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "cinelog_secret",
    resave: false,
    saveUninitialized: true
  })
);

// ⬅️ PENTING: router dipakai di root "/"
app.use("/", routes);

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});
