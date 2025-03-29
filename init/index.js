
const mongoose = require("mongoose");
const indata = require("./data.js");
const Listing = require("../models/listing.js");
const path = require("path");
const { object } = require("joi");





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

const initDb = async()=>{
    await Listing.deleteMany({});
    indata.data = indata.data.map((obj)=>({...obj, owner : '66f69d5b5be152fd133db1dc'}));
    await Listing.insertMany(indata.data);
    console.log("data initialized");
}


initDb();