const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");

const { validatereview, isLoggedIn, isreviewAuthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/review.js");






//reviews
//post review
router.post("/",isLoggedIn, validatereview, wrapAsync(reviewcontroller.Createreview));

//review delete
router.delete("/:reviewId",isLoggedIn,isreviewAuthor, wrapAsync(reviewcontroller.destroyreview));

module.exports = router;