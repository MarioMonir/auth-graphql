const express = require("express");
const app = express();
const port = 3000;

// test pages
const { signup, login, logout, home } = require("./test.pages.js");

// ===========================================================
app.get("/", (_, res) => res.send(home));
app.get("/login", (_, res) => res.send(login));
app.get("/logout", (_, res) => res.send(logout));
app.get("/signup", (_, res) => res.send(signup));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
