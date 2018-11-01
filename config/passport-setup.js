const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const fs = require("fs");
const path = require("path");

var easyQ;
var mediumQ;
var hardQ;
var qSet = [];

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

let easyPath = path.join(__dirname, "../assets/quiz_easy.json");
fs.readFile(easyPath, "utf8", function(err, data) {
  if (err) {
    throw err;
  }
  easyQ = JSON.parse(data);
});

let mediumPath = path.join(__dirname, "../assets/quiz_medium.json");
fs.readFile(mediumPath, "utf8", function(err, data) {
  if (err) {
    throw err;
  }
  mediumQ = JSON.parse(data);
});

let hardPath = path.join(__dirname, "../assets/quiz_hard.json");
fs.readFile(hardPath, "utf8", function(err, data) {
  if (err) {
    throw err;
  }
  hardQ = JSON.parse(data);
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: process.env.CLIENTID,
      clientSecret: process.env.SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          done(null, currentUser);
          // do something
        } else {
          // if not, create user in our db
          qSet = [];
          for (var i = 0; i < 8; i++) {
            question =
              easyQ.questions[
                Math.floor(Math.random() * easyQ.questions.length)
              ];
            if (!qSet.includes(question)) {
              qSet.push(question);
            } else {
              i--;
            }
          }
          for (var i = 0; i < 7; i++) {
            question =
              mediumQ.questions[
                Math.floor(Math.random() * mediumQ.questions.length)
              ];
            if (!qSet.includes(question)) {
              qSet.push(question);
            } else {
              i--;
            }
          }
          for (var i = 0; i < 5; i++) {
            question =
              hardQ.questions[
                Math.floor(Math.random() * hardQ.questions.length)
              ];
            if (!qSet.includes(question)) {
              qSet.push(question);
            } else {
              i--;
            }
          }
          new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            dpurl: profile.photos[0].value,
            googleId: profile.id,
            score: 0,
            level: 0,
            elapsedTime: 0,
            assignedQSet: shuffle(qSet)
          })
            .save()
            .then(newUser => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
