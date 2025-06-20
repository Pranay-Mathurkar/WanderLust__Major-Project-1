    
const User = require("../models/user")

 module.exports.renderSignupForm =    (req,res) => {
        res.render("users/signup.ejs");
    }

// sign up

 module.exports.signup =   async(req,res) => {
 
        try{
            let {username, email ,password} =req.body;
            const newUser= new User({email,username});
            User.register(newUser,password);
            const registeredUser = await User.register(newUser,password);
           
            req.login(registeredUser, (err) => {
                if(err) {
                    return next(err);
                }

                req.flash("success", "Welcome to WANDERLUST!");
                res.redirect("/listings");


            });   // if user signup then it will also become login

            

        } catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");

        }
  
};

// login



module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}




module.exports.login = async(req,res) => {
       
    req.flash("success","Welcome to Wanderlust! You are logged in!");
   
    // if user login in one tab then it will remain login in all tab ex. for edit creat new list all have same login info
   
    let redirectUrl = res.locals.redirectUrl || "/listings";    // check reason for this

    res.redirect(redirectUrl);
}




    // for logout  

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err) {
          return next(err);

        }
        req.flash("success","you are logged out !")
        res.redirect("/listings");
    })
}