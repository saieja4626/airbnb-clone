const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.Createreview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
       //console.log(newreview);
    listing.reviews.push(newreview);
 
    await newreview.save();
    await listing.save();
    req.flash("success","new review added!");
    res.redirect(`/listings/${listing._id}`);
 
 
 };


 module.exports.destroyreview = async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull:{reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`);
};