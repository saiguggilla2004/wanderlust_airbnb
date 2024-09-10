const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url:String,
    filename:String
  },
  price: {
    type: Number,
  },
  location: {
    type: String
   
  },
  country: {
    type: String,
  },
  reviews:
    [
      {
      type:mongoose.Schema.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  });
 
  //creating a mongoose middleware to delete the listings when a listing is deleted
  listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing)
    {
      await Review.deleteMany({_id:{$in:listing.reviews}});
    }
  });

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;
