const router = require("express").Router();
const passport = require("passport");

// Auth Login with Google
router.get("/login", passport.authenticate("google", { scope: ["email"] }));

//Callback routes for google login
router.get("/login/redirect", passport.authenticate("google"), (res, req) => {
  res.send("Callback initiated");
});

router.get("/logout", (res, req) => {
  res.send("Logging out!");
});

module.exports = router;
