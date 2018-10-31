const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const User = require("./models/user-model");

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

// parse page request body
// app.use(bodyParser);

// Home route
const userCheck = (req, res, next) => {
  if (req.user) {
    res.redirect("/profile");
  } else {
    next();
  }
};
const participationCheck = (req, res, next) => {
  if (!req.user) {
    //if no one is loged ins
    res.redirect("/auth/google");
  } else {
    // if some one is logged in
    next();
  }
};

app.get("/", userCheck, (req, res) => {
  res.render("home.ejs", { user: req.user });
});

app.get("/participate", participationCheck, (req, res) => {
  var option = req.param("options");
  if (req.user.level == 20) {
    res.redirect("/profile");
  } else {
    console.log(
      option,
      req.user.level,
      req.user.score,
      req.user.assignedQSet[req.user.level].correctIndex
    );
    User.findOne({ email: req.user.email }, function(err, doc) {
      if (err) {
        console.log(err);
      }
      if (option) {
        if (option == doc.assignedQSet[req.user.level].correctIndex) {
          doc.score = doc.score + doc.assignedQSet[req.user.level].score;
        }
        doc.level = doc.level + 1;
      }
      doc.save();
    });
    res.render("participate.ejs", { user: req.user });
  }
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
