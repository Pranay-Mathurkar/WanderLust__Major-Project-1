const express = require("express");
const router = express.Router();
 
const wrapAsync = require("../utils/wrapAsync.js");


const Listing = require("../models/listing.js");

const {isLoggedIn, isOwner ,  validateListing} = require("../middleware.js");



const listingController =require("../controllers/listings.js");

const multer  = require('multer')

 const {storage} = require("../cloudConfig.js");

const upload = multer({storage});  // to upload file





















router.route("/")      // for getting all funtion of "/ " in one code for simplexity 


// index route 

.get( wrapAsync(listingController.index))


// create route


.post(
    isLoggedIn,
    
     upload.single('listing[image]'),
     validateListing, 
     wrapAsync( listingController.createListing)
 );



// new route 
 
 
router.get("/new",isLoggedIn,listingController.renderNewForm);





 router.route("/:id") 

 // show route

 .get(wrapAsync( listingController.showListing ))


 // update route

 .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
     wrapAsync(listingController.updateListing))

 // delete route


.delete(
        isLoggedIn,
        isOwner,
          wrapAsync(listingController.destroyListing));






 // edit route
 
 
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
     wrapAsync( listingController.renderEditForm));
















 
//index route{initial code }

// router.get("/", wrapAsync(listingController.index));
 
 
 
 
 
 
 // show route
 
// router.get("/:id",wrapAsync( listingController.showListing ));
 
 
 
 // create route{inital code}
 
// router.post("/",
//     isLoggedIn,
//      validateListing, 
//      wrapAsync( listingController.createListing)
//  );
 
 // edit route
 
 
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
     wrapAsync( listingController.renderEditForm));
 
 // update route
 
 
// router.put("/:id", 
//     isLoggedIn,
//     isOwner,
//     validateListing,
//      wrapAsync(listingController.updateListing));
 
 


 // delete route
 
 
// router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//       wrapAsync(listingController.destroyListing));
 
 
 module.exports = router;