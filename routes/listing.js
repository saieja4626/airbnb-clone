const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const listingcontrollers = require("../controllers/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudconflict.js")
const upload = multer({storage});



//INDEX ROUTE
router.get("/", wrapAsync(listingcontrollers.index));


//adding new route and create route
router.route("/new")
.get( isLoggedIn, listingcontrollers.rendernewform)
.post(isLoggedIn,upload.single('Listing[image]'),validateListing, wrapAsync(listingcontrollers.creatListing))




//adding show route, update route and delete route
router.route("/:id")
.get(wrapAsync(listingcontrollers.showListing))
.put(isLoggedIn,isOwner,upload.single('Listing[image]'), validateListing, wrapAsync(listingcontrollers.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync(listingcontrollers.destroylisting));

 
 


//create edit
router.get("/:id/edit" ,isLoggedIn,isOwner, wrapAsync(listingcontrollers.rendereditform));





module.exports = router;