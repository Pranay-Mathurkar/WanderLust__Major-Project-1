const Listing= require("./models/listing")
const Review= require("./models/review")
const ExpressError = require("./utils/ExpressError.js");

const {listingSchema,reviewSchema} = require("./schema.js");




// to check the user is log in or not before creat new list
  
module.exports.isLoggedIn = (req ,res ,next ) => {
         
    if(!req.isAuthenticated()){

      //redirect  URL save
      req.session.redirectUrl = req.orignalUrl;

        req.flash("error", "you must be logged in to create listing !");     //direct method of passport to ckeck for log in or not 
      return  res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next ) => {
  if( req.session.redirectUrl){
    req.locals.redirectUrl =  req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next) => {
    
    let {id} = req.params;
      
       let listing= await Listing.findById(id);
  
       if(!listing.owner.equals(res.locals.currUser._id)){
         
        req.flash("error", "You are not the Owner of this listing!")
      
          return  res.redirect(`/listings/${id}`);
      
        }

        next();
      };
  


      // to enter all information
      //1.for form
      
      module.exports.validateListing=(req,res,next) => {
          let {error}=  listingSchema.validate(req.body);
      
              if(error){
                  let errMsg = error.details.map((el) => el.message).join(" ,");
                  throw new ExpressError(400, errMsg)
              }
              else{
                  next();
              }
      }

      
      // to get information
      
      
      
      //1.for review
      
      module.exports.validateReview=(req,res,next) => {
          let {error}=  reviewSchema.validate(req.body);
      
              if(error){
                  let errMsg = error.details.map((el) => el.message).join(" ,");
                  throw new ExpressError(400, errMsg)
              }
              else{
                  next();
              }
      }





      module.exports.isReviewAuthor = async (req,res,next) => {
    
        let {id ,reviewId} = req.params;
          
           let review= await Review.findById(reviewId);
      
           if(!review.author.equals(res.locals.currUser._id)){
             
            req.flash("error", "You are not the Author of this review!")
          
              return  res.redirect(`/listings/${id}`);
          
            }
    
            next();
          };
      