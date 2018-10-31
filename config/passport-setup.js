const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");

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
      console.log(profile);

      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          // already have this user
          console.log("user is: ", currentUser);
          done(null, currentUser);
          // do something
        } else {
          // if not, create user in our db
          new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            dpurl: profile.photos[0].value,
            googleId: profile.id,
            score: 0,
            level: 0
          })
            .save()
            .then(newUser => {
              console.log("created new user: ", newUser);
              // do something
              done(null, newUser);
            });
        }
      });
    }
  )
);
