const mongoose=require("mongoose");
const initdata=require("./data.js");

const Listing=require("../models/listing.js")

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main()
{
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("connected to the database");
})
.catch(()=>{
    console.log("an error occured");
})

const initDB=async()=>{
    await Listing.deleteMany({});
 
    // initdata.data.forEach(listing=>{
    //     listing.owner="66114d108ae3d908d524c9cd"
    // })
   
    for(let i=0;i<initdata.data.length;i++){
        initdata.data[i].owner='66114d108ae3d908d524c9cd';
    }
    // initdata.data=initdata.data.map((obj)=>({...obj,owner:"66114d108ae3d908d524c9cd"}));
    await Listing.insertMany(initdata.data);
    console.log("the database was initialized");
    console.log(initdata);
}
initDB();