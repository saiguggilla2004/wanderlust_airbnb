const Listing=require("../models/listing.js")
const Review=require("../models/review.js")

module.exports.createReview=async (req,res,next)=>{
    if(req.isAuthenticated()){
      let {id}=req.params;
     let listing= await Listing.findById(id).populate('reviews')
      
    //validations
       console.log(listing);
        console.log(req.body);
        let newComment=req.body.comment;
        let newRating=req.body.rating;
       
        let newReview=new Review({
            comment:newComment,
            rating:newRating
        });
        newReview.author=req.user._id;
        console.log(newReview)
    
       try{
        if(!newComment)
        {
          next(new ExpressError(400,"Comment should not be empty"));
        }
        else
        {
          
        await newReview.save();
        
        listing.reviews.push(newReview);
        let ress=await listing.save();
        req.flash("success","new review created")
        res.redirect(`/listings/${listing._id}`);
        }
       }
       catch(err)
       {
        next(err);
       }
        
    }
    else{
      let {id}=req.params;
      req.flash("error","to comment you must be loggeed in");
      res.redirect(`/listings/${id}`);
    }
      
      };

module.exports.deleteReview=async (req,res)=>{
    if(req.isAuthenticated())
    {
      let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    let listing=await Listing.findById(id); 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","new review is deleted")
   res.redirect(`/listings/${id}`);
    } else{
      let {id}=req.params;
      req.flash("error","to comment you must be loggeed in");
      res.redirect(`/listings/${id}`);
    }
    
  };
