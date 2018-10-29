const express = require("express");
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

// Setup static files and views directory
app.set("views", __dirname + "/views");
app.use("/public", express.static("public"));

//Connect to MongoDB
mongoose.connect(
  process.env.DBURI,
  () => {
    console.log("connected to mongodb");
  }
);

// Authentication routes
app.use("/auth", authRoutes);
// Home route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(port, () => console.log("Listening on port", port));
