const Listing = require("../models/listing");

//index route

module.exports.index =  async (req,res) => {
      
    const allListings = await  Listing.find({});
  
    res.render("listings/index.ejs",{ allListings });
     } ;



// new route 

module.exports.renderNewForm =   (req,res) => {

        //direct method of passport to ckeck for log in or not is given in middleware.js
   
      res.render("listings/new.ejs");
   };



 // show route


   module.exports.showListing   = async (req,res,next) => {
        let {id} = req.params;
        const listing = await Listing.findById(id)
        .populate({
           path : "reviews",
           populate : {
               path : "author",  // to add author to each review
           },
        })
        .populate("owner");   // use populate to show review by id
       
        if(!listing){     // if listing not exist
           req.flash("error", " Listing you requested for does not exist ! !");
           res.redirect("/listings");
       }
       
        res.render("listings/show.ejs",{listing});
    };





   



// create route


module.exports.createListing  = async (req,res,next) => {
       
    let url = req.file.path;
    let filename = req.file.filename;

     const newListing= new Listing(req.body.listing);
     
     newListing.owner = req.user._id;
     // to store url and filename in image

     newListing.image = {url,filename};

     await newListing.save();
     
     req.flash("success", "New Listing Created !");
     res.redirect("/listings");
    }



     




// edit route

    module.exports.renderEditForm =  async (req,res,next) => {
         let {id} = req.params;
         const listing = await Listing.findById(id);
    
          
         if(!listing){     // if listing not exist
            req.flash("error", " Listing you requested for does not exist ! !");
            res.redirect("/listings");
        }
        
        // to show the orignal image in low quality in edit form

        let orignalImageUrl = listing.image.url;
        orignalImageUrl = orignalImageUrl.replace("upload","/upload/h_300,w_250")
         res.render("listings/edit.ejs",{listing , orignalImageUrl});
     
     }



      // update route


module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;

  // Step 1: Find listing
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Step 2: If file changed, update image
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  
   try {

    // Step 4: Save updated listing
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log("Error updating coordinates:", err);
    req.flash("error", "Something went wrong. Try again.");
    res.redirect(`/listings/${id}`);
  }
};



        // delete route


       module.exports.destroyListing =  async (req,res,next) => {
            let {id} = req.params;
           let deletedListing = await Listing.findByIdAndDelete(id);
           console.log(deletedListing )
           req.flash("success", "Listing Deleted !");
           res.redirect("/listings");
        }