const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const Datastore = require("@google-cloud/datastore");

// const datastore = new Datastore({
//   projectId: process.env.PROJECTID
// });
const datastore = new Datastore();

const kind = "User";

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/login/redirect",
      clientID: process.env.CLIENTID,
      clientSecret: process.env.SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      var googleid = profile.id;
      var gmail = profile.emails[0].value;
      console.log(profile);

      const query = datastore.createQuery(kind).filter("id", "=", googleid);
      datastore.runQuery(query).then(results => {
        console.log(results[0].length === 0);
        if (results[0].length === 0) {
          var userKey = datastore.key([kind, googleid]);
          var user = {
            key: userKey,
            data: {
              id: googleid,
              email: gmail,
              name: profile.displayName,
              score: 0
            }
          };
          datastore
            .save(user)
            .then(() => {
              console.log("Saved " + user.data.name + " " + user.data.email);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("user " + user.data.name + "already signed up.");
        }
      });
    }
  )
);
