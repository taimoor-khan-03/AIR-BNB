const listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");

module.exports.isLogged = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// listing - authorization
module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    const Listing = await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

// review's - authorization
module.exports.isAuthor = async (req,res,next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req,res,next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};