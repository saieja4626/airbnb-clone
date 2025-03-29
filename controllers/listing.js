const Listing = require("../models/listing.js");



module.exports.index=async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    
 }


 module.exports.rendernewform =(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id)
   .populate({
    path :"reviews" ,
     populate:{path: "author"},
    })
    .populate("owner");
   if(!listing){
    req.flash("error","listing does not exist, check again!");
    res.redirect("/listings");
   }
   //console.log(listing);
   res.render("listings/show.ejs",{listing});
};

module.exports.creatListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");

    
}

module.exports.rendereditform = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing does not exist, check again!");
        res.redirect("/listings");
       }

       let OriginalImageUrl = listing.image.url;
       //OriginalImageUrl = OriginalImageUrl.replace("/upload", "/upload/w_25");
       const url = new URL(OriginalImageUrl);
    url.searchParams.set('w', '200');
    OriginalImageUrl = url.toString();
    res.render("listings/edit.ejs", {listing, OriginalImageUrl});
    
}

module.exports.updateListing = async(req,res)=>{
   
    let {id} = req.params;

   let listing = await Listing.findByIdAndUpdate(id, {...req.body.Listing}, { new: true });

   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
}
   req.flash("success","listing updated!");
   res.redirect(`/listings/${id}`);
}

module.exports.destroylisting = async (req,res)=>{
    let{id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}