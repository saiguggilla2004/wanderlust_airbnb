const Listing=require("../models/listing.js")
const ExpressError=require("../utils/ExpressError.js")
module.exports.index=async (req, res,next) => {
  
    let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
  
};

// module.exports.renderNewForm=;

//   module.exports.postNewListing=;


//   module.exports.viewOneListing=;

//   module.exports.renderEditForm=;

//   module.exports.editTheListing=;

//    module.exports.deleteListing=;

 