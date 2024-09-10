const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const ExpressError=require("../utils/ExpressError.js");
const passport = require("passport");
const {redirectAfterLogin}=require("../middleware.js")
const {saveTheredirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js")
router.get("/signup",userController.renderSignUpForm);

router.post("/signup",userController.signUpUser);

//login route

router.get("/login",userController.renderLoginForm)

router.post("/login",saveTheredirectUrl,redirectAfterLogin,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.loginTheUser);

//logout route
router.get("/logout",userController.logoutUser);




module.exports=router;