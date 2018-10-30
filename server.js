const express = require("express");
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
const app = express();

// Setup static files and views directory
app.set("views", __dirname + "/views");
app.use("/public", express.static("public"));

// Authentication routes
app.use("/auth", authRoutes);
// Home route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
