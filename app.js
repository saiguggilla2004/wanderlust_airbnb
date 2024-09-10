
if(process.env.NODE_ENV !="production")
{
  require('dotenv').config();
}
console.log(process.env.secret);
const express = require("express");
const app = express();
const session=require("express-session");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review=require("./models/review.js");
const path = require("path");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const flash=require("connect-flash")
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require("./models/user.js");
// const { valid } = require("joi");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
let port = 3000;
app.use(express.static(path.join(__dirname,"/public")))
const sessionOptions={
  secret:"secretOption",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};
app.use(session(sessionOptions));
app.use(flash())
//initializing the passport
app.use(passport.initialize());
//initialize the session
app.use(passport.session());
//using the LocalStratergy
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs",ejsMate); 

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//function to connect with the mongoDB
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
//listening to the port
app.listen(port, () => {
  console.log("listening to the port " + port);
});
//root path
app.get("/", (req, res) => {
  res.send("here i am working");
});


// app.get("/demouser",async (req,res)=>{
//    let fakeUser=new User({
//     email:"guggilaprakash161@gmail.com",
//     username:"delta student1",
//    });

//   let registeredUser= await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// })
app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.currentUser=req.user;
  console.log(req.user,"this is res.user")
  next();

})
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//accepts all requests
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message})
  // res.status(statusCode).send(message);
  
});



