const express=require('express');
const app=express();
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const { isOwner } = require('../middleware.js');
  const multer=require("multer")
  const {storage}=require("../cloudConfig.js")
  const upload=multer({storage})
  app.use(express.urlencoded({ extended: true }));
app.use(express.json());
  
const listingController=require("../controllers/listings.js")

// const validateListing=(req,res,next)=>{
//     let {error}=listingSchema.validate(req.body);
   
//     if(error)
//     {
//       next(new ExpressError(400,error)) 
//     }
//     else{
//       next();
//     }
//   }

//index route
  router.get("/",wrapAsync(listingController.index) );

//adding the new listing by rendering the form
router.get("/new",(req,res)=>{
  if(req.isAuthenticated())
  {
    res.render("listings/new.ejs");
  }
  else{
     req.session.redirectTo=req.originalUrl;
     console.log(req.session.redirectTo);
      req.flash("error","you must be logged in to create a new listing")
      res.redirect("/login");
  }
   
  });
//route post the new listing
// router.post("/",listingController.postImage);
  router.post("/",upload.single('image'),(req,res,next)=>{
    if(req.isAuthenticated())
    {
      let url=req.file.path;
      let filename=req.file.filename;
      console.log(url);
      console.log(filename)
      let {title:title,location:location,country:country,price:price,description:newdescription,image:image} = req.body;
    let newListing=req.body;
    newListing.owner=req.user._id;
    if(!newListing){
      next(new ExpressError(400,"Send the valid data for the listing"))
    }
  
    if(!newListing.title){
      next(new ExpressError(400,"title is invlaid or empty"))
    }
    if(!newListing.description){
      next(new ExpressError(400,"description is empty"))
    }
    if(!newListing.location){
      next(new ExpressError(400,"location is empty"))
    }
    if(!newListing.price){
      next(new ExpressError(400,"price is invalid"))
    }
    if(!newListing.country){
      next(new ExpressError(400,"country is invalid"))
    }
    
    let listing=new Listing({
      title:newListing.title,
      location:newListing.location, 
      description:newListing.description,
      country:newListing.country,
      price:newListing.price,
      
    });
    listing.owner=req.user._id;
    listing.image.url=url;
    listing.image.filename=filename;
    listing.save()
    .then(()=>{
      console.log("inserted into the data base succesfully");
      req.flash("success","new Listing is created")
      res.redirect("/listings");
    })
    .catch((err)=>{
     next(new ExpressError(400,"send the valid data for listing"))
    })
    }
    else{
      req.flash("error","you need to login");
      res.redirect("/listings");
    }
  });
  
//to view specific listing
router.get("/:id",wrapAsync (async (req, res,next) => {
   
  let { id } = req.params;
  // res.send("this is in active state");
  let list = await Listing.findById(id).populate({
    path:'reviews',
    populate :{
      path:"author"
    }
  }).populate('owner');
  console.log(list)
  if(!list)
  {
    req.flash("error","Listing does not exist");
    res.redirect("/listings")
  }
  res.render("listings/show.ejs", { list });
 
 
}));

  //edit the listings
  router.get("/:id/edit",isOwner,wrapAsync(async (req,res)=>{
    if(req.isAuthenticated())
    {
      let {id}=req.params;
      let targetListing=await Listing.findById(id);
      console.log("this is in req.params"+req.params)
 
      if(!targetListing)
      {
        req.flash("error","Listing does not exist");
        res.redirect("/listings")
      }
      res.render("listings/edit.ejs",{targetListing});
    }
    else{
      req.session.redirectTo=req.originalUrl;
      req.flash("error","you must login to edit the listing");
      res.redirect("/login");
    }
    
  }));

  //put route to edit the route
  
  router.put("/:id",isOwner,async (req,res,next)=>{
    const list=req.body;
    console.log(list);
    if(req.isAuthenticated())
    {
      let {id}=req.params;
    const list=req.body;
    console.log(list);
    let newListing=req.body;
    console.log("new listing is",newListing)
    
    // let url=req.file.path;
    // let filename=req.file.filename;
    // const newImage={
    //   url:url,
    //   filename:filename
    // };
     if(!newListing){
       next(new ExpressError(400,"Send the valid data for the listing"))
     }
   
     if(!newListing.title){
       next(new ExpressError(400,"title is invlaid or empty"))
     }
     if(!newListing.description){
       next(new ExpressError(400,"description is empty"))
     }
     if(!newListing.location){
       next(new ExpressError(400,"location is empty"))
     }
     if(!newListing.price){
       next(new ExpressError(400,"price is invalid"))
     }
     if(!newListing.country){
       next(new ExpressError(400,"country is invalid"))
     }
      // let listing=await Listing.findById(id);
      // if(!listing.owner.equals(res.locals.currentUser._id)){
      //   req.flash("error","you dont have any permissions to edit this listing");
      //   return  res.redirect(`/listings/${id}`)
      // }
      
      
        // await Listing.findByIdAndUpdate(id,{image:newImage});
      
      await Listing.findByIdAndUpdate(id,{title:list.title});
      await Listing.findByIdAndUpdate(id,{description:list.description});
      await Listing.findByIdAndUpdate(id,{price:list.price});
      await Listing.findByIdAndUpdate(id,{location:list.location});
      await Listing.findByIdAndUpdate(id,{country:list.country});
      req.flash("success","Listing is Updated")
     res.redirect(`/listings/${id}`)
   
     console.log(req.body);
    }
    else{
       req.session.redirectTo=req.originalUrl;
      req.flash("error","you must need to login to update a listing");
      res.redirect("/login");
    }
   });
  
 
  
  //delete the listings
  router.delete("/:id/delete",isOwner,wrapAsync( async (req,res)=>{
   
      
    if(req.isAuthenticated())
    {
     let {id}=req.params;
     let listing=await Listing.findById(id);
    //  if(!listing.owner.equals(res.locals.currentUser)){
    //    req.flash("error","you dont have any permissions to delete this listing")
    //    return res.redirect(`/listings/${id}`);
    //  }
     let deletedlist=await Listing.findByIdAndDelete(id);
     console.log(deletedlist);
     req.flash("success","new Listing is Deleted")
     res.redirect("/listings");
    }
    else{
     req.flash("error","you must login before deleting a listing");
     res.redirect("/listings");
    }
     
     
 }))

  router.get("/", wrapAsync(async (req, res,next) => {
  
    let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
  
}));

module.exports.postImage=(req,res)=>{
  res.send(req.file);
}

  module.exports=router;
  
  
  
  