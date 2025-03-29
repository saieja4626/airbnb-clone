const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose");

const userschema = new Schema({
    email:{
        type: String,
        required : true
    },

});
userschema.plugin(passportlocalmongoose);
userschema.pre("deleteOne", { document: true, query: false }, async function (next) {
    await Listing.deleteMany({ userId: this._id }); // Deletes all listings of this user
    console.log(`Deleted all listings for user: ${this._id}`);
    next();
});

const User = mongoose.models.User || mongoose.model('User', userschema);

module.exports = User;
//module.exports = mongoose.model("User",userschema);

