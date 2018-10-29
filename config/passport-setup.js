const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/login/redirect",
      clientID: process.env.CLIENTID,
      clientSecret: process.env.SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      //Check if user already exists
      User.findOne({ googleid: profile.id }).then(currentUser => {
        if (currentUser) {
          // Already have the user
          console.log("User is: " + currentUser);
        } else {
          // elsem create the new User.
          new User({
            username: profile.displayName,
            googleid: profile.id
          })
            .save()
            .then(newUser => {
              console.log("new user create: " + newUser);
            });
        }
      });
    }
  )
);
