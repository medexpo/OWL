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
  if (req.user.level >= 19) {
    res.redirect("/profile");
  } else {
    // console.log(
    //   "option in Request: ",
    //   option,
    //   "Level in request: ",
    //   req.user.level,
    //   "Score in request: ",
    //   req.user.score,
    //   "correct index for current question: ",
    //   req.user.assignedQSet[req.user.level].correctIndex
    // );
    User.findOne({ email: req.user.email }, function(err, doc) {
      if (err) {
        console.log(err);
      }
      // console.log(
      //   "Doc: ",
      //   doc.level,
      //   doc.score,
      //   doc.assignedQSet[doc.level].correctIndex
      // );
      // console.log(option == req.user.assignedQSet[req.user.level].correctIndex);
      if (option == req.user.assignedQSet[req.user.level].correctIndex) {
        console.log("score updated");
        doc.score =
          req.user.score + req.user.assignedQSet[req.user.level].score;
      }
      if (typeof option !== "undefined") {
        doc.level = doc.level + 1;
      }

      doc.save();
      console.log("");

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
    partdoc = partdoc.sort((a, b) => parseInt(b.score) - parseInt(a.score));
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
