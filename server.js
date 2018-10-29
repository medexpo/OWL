const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.use("/public", express.static("public"));
app.set("views", __dirname + "/views");
// app.set("view engine", "ejs");

// Home route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(port, () => console.log("Listening on port", port));
