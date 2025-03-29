const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controlleruser = require("../controllers/users.js");


router.route("/signup")
.get(controlleruser.rendersignup)
.post(wrapAsync(controlleruser.signup));



router.route("/login")
.get(controlleruser.renderlogin )
.post(
saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash:true,}),
 controlleruser.login);


 


router.get("/logout",controlleruser.logout);

module.exports = router;