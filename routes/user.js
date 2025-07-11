const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../routes/middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get( userController.renderSignupForm)
.post(wrapAsync( userController.signUp));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl ,
passport.authenticate('local',{ failureRedirect: "/login",failureFlash: true }),
userController.login );

router.get("/logout", userController.logout);

module.exports = router;