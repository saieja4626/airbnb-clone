if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expresserror.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");
const sessions= require("express-session");
const { createSecretKey } = require("crypto");
const flash  = require("connect-flash");
const passport = require("passport");
const LocalStrategy= require("passport-local");
const User = require("./models/user.js");
const { getMaxListeners } = require("events");



//const cookieparser = require("cookie-parser");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
//app.use(cookieparser);


//const password = "raju"; // Choose a new password
//const salt = crypto.randomBytes(32).toString("hex");
//const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

//console.log("New Salt:", salt);
//console.log("New Hash:", hash);
const crypto = require("crypto");

function verifyPassword(enteredPassword, user) {
    const inputHash = crypto.pbkdf2Sync(enteredPassword, user.salt, 10000, 64, "sha512").toString("hex");
    
    console.log("Entered password:", enteredPassword);
    console.log("Salt from DB:", user.salt);
    console.log("Generated Hash:", inputHash);
    console.log("Stored Hash:", user.hash);
    console.log("Match:", inputHash === user.hash);
    
    return inputHash === user.hash;
}





const mongourl = "mongodb://127.0.0.1:27017/wounderlust";
main()
.then(()=>{
    console.log("success");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(mongourl);
}

const sessionOptions = {
    secret:"mysecretstring",
    resave:false,
    saveUninitialized: true,
    cookie: {
        expires:Date.now()+1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3, // Example: 3 days
        httpOnly: true,
    },

};

app.use(sessions(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//app.get("/demouser", async (req,res,next)=>{
   // let fakeuser = new User({
       // email :  "student@gmail.com" ,
    //username : "raju"
  //})
 // let registeruser = await User.register(fakeuser,"hellojava");
  //res.send(registeruser);
//});



app.listen(8080,(req,res)=>{
    console.log("its listening");
})

app.use((req, res, next) => {
    console.log("Received request:", req.method, req.url);
    next();
});






app.use("/listings",listings);

app.use("/listings/:id/reviews", reviews);

app.use("/", users);




app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err, req, res, next)=>{
    let{statusCode=500, message} =  err;
    res.status(statusCode).render("error.ejs",{ err });


});




