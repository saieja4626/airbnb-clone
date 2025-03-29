const joi = require("joi");

const listingschema = joi.object({
   Listing : joi.object({
   title : joi.string().required(),
   description : joi.string().required(),
   location : joi.string().required(),
   country : joi.string().required(),
   price : joi.number().required().min(0),
   image : joi.string().allow("",null)

}).required()
});


const reviewschema = joi.object({

   review :joi.object({
       rating: joi.number().required().min(1).max(5),
       comment:joi.string().required(),
   }).required()
   
   
   });

module.exports = { listingschema, reviewschema };