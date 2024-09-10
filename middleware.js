const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
// module.exports.isLoggedIn=(req,res,next)=>{
//     if(!req.isAuthenticated()){
//        req.flash("error","you must logged in to create a new listing");
//        return res.redirect("/login");
//     }
//     next();
// };

module.exports.redirectAfterLogin=(req,res,next)=>{
    
        req.flash("success","logged in succesfully");
        console.log("in 2nd middleware ",res.locals.redirectUrl)
      next();
}

module.exports.saveTheredirectUrl=(req,res,next)=>{
    res.locals.redirectUrl=req.session.redirectTo;
    console.log("in 1st middleware ",res.locals.redirectUrl)
    next();
};

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  console.log("req.body in isOwner middleware is ",req.body)
  let listing=await Listing.findById(id);
   if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","you are not the owner of this listing");
    return res.redirect(`/listings/${id}`)
   }
   next();
}

module.exports.isUser=async(req,res,next)=>{
     let {reviewId}=req.params;
     let {id}=req.params;
     let review=await Review.findById(reviewId);
     if(res.locals.currentUser && !review.author.equals(res.locals.currentUser._id)){
       req.flash("error","you are not the author of this review");
       return res.redirect(`/listings/${id}`)
     }
     next();
}