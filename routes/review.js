const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const {isUser}=require("../middleware.js")
//deleting the reviews

const reviewController=require("../controllers/reviews.js")

router.delete("/:reviewId",isUser,reviewController.deleteReview);

  //for posting the review
router.post("/",(reviewController.createReview));
   
    module.exports=router;