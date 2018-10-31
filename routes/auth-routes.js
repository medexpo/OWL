const router = require("express").Router();
const passport = require("passport");

// Auth Login with Google
router.get("/login", (req, res) => {
  res.send("Logging in!");
});
router.get("/logout", (req, res) => {
  res.send("Logging out!");
});

router.get("/google", passport.authenticate("google", { scope: ["email"] }));
//Callback routes for google login
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.send("Callback initiated");
  console.log("callback");
});

module.exports = router;
