const User=require("../models/user.js")

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
 };

 module.exports.signUpUser=async (req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({
            username:username,
            email:email
        });
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,function(err){
            if(err){
                next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
       
    }
    catch(err){
        req.flash("error","user already exists in the database")
        // next(new ExpressError(400,"user already exists in the database"))
        res.redirect("/signup")
    }
    
};


module.exports.renderLoginForm=(req,res)=>{{
    res.render("users/login.ejs")
 }};

 module.exports.loginTheUser=async (req,res)=>{
    req.flash("success","logged in succesfully");
    console.log("in the main ",res.locals.redirectUrl)
    if(res.locals.redirectUrl)
    {
       res.redirect(res.locals.redirectUrl)
    }
    else{
       res.redirect("/listings");
    }
   };

   module.exports.logoutUser=(req,res,next)=>{
    req.logout((err)=>{
      if(err)
      {
 next(new ExpressError(404,"something went wrong while logout"))
      }
      else{
          req.flash("success","you have been loggedout succesfully");
          res.redirect("/listings");
      }
    })
};