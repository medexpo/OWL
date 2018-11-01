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

const userCheck = (req, res, next) => {
  if (req.user) {
    res.redirect("/profile");
  } else {
    next();
  }
};
const participationCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/google");
  } else {
    next();
  }
};

app.get("/", userCheck, (req, res) => {
  res.render("home.ejs", { user: req.user });
});

app.get("/participate", participationCheck, (req, res) => {
  var option = req.param("o");
  var level = req.param("l");
  var time = req.param("t");
  if (req.user.level >= 19) {
    res.redirect("/profile");
  } else {
    User.findOne({ email: req.user.email }, function(err, doc) {
      if (err) {
        console.log(err);
      }

      if (level == req.user.level) {
        if (option == req.user.assignedQSet[req.user.level].correctIndex) {
          doc.score =
            req.user.score + req.user.assignedQSet[req.user.level].score;
        }
        if (typeof option !== "undefined") {
          doc.level = doc.level + 1;
          doc.elapsedTime = doc.elapsedTime + time;
        }
      }
      doc.save();

      res.render("participate.ejs", { user: doc });
    });
  }
});

app.get("/leaderboard", (req, res) => {
  User.find({ score: { $gt: -1 } }, function(err, partdoc) {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < partdoc.length; i++) {
      partdoc[i].assignedQSet = null;
    }
    partdoc = partdoc.sort((a, b) => {
      var diff = parseInt(b.score) - parseInt(a.score);
      if (diff === 0) {
        return parseInt(a.elapsedTime) - parseInt(b.elapsedTime);
      } else return diff;
    });
    res.render("leaderboard.ejs", { userlist: partdoc });
  });
});

app.get("/rules", (req, res) => {
  res.render("rules.ejs");
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
