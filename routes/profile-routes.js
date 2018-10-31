const router = require("express").Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    //if no one is loged ins
    res.redirect("/auth/google");
  } else {
    // if some one is logged in
    next();
  }
};
router.get("/", authCheck, (req, res) => {
  //   res.send(
  //     "User: " +
  //       req.user.name +
  //       "\nEmail: " +
  //       req.user.email +
  //       "\nScore: " +
  //       req.user.score
  //   );
  res.render("profile", { user: req.user });
});

module.exports = router;
