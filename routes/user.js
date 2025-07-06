const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Route to render the signup form
router.get("/signup", userController.renderSignupForm);

// Route to signup the User
router.post("/signup", wrapAsync(userController.signup));

/* Route to render the login form */
router.get("/login", userController.renderLoginForm);

/* Route to handle user login */
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
