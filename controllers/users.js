const User = require("../models/user.js");

module.exports.renderSignupForm =  (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req,res,next) => {
    try{
        let  {email,username,password} = req.body;
        let  newUser = new User({
            email ,
            username 
        });
    
        let registeredUser = await User.register(newUser,password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success","welcome on wanderlust!");
            res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req,res) => {
    req.flash("success","welcome back on wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err); 
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
}