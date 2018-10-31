const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");

const app = express();

// Setup static files and views directory
// app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use("/public", express.static("public"));

app.use(
  cookieSession({
    maxAge: 3 * 60 * 60 * 1000,
    keys: [process.env.CRYPTKEY]
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(
  process.env.DBURI,
  () => {
    console.log("Connected to DB!");
  }
);

// Authentication routes
app.use("/auth", authRoutes);

// Profile routes
app.use("/profile", profileRoutes);
  
// Home route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
