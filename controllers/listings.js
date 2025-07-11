const listing = require("../models/listing.js");

module.exports.index = async (req,res) => {
    let allListings = await listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListings = async (req,res) => {
    let {id} = req.params;
    let Listing = await listing.findById(id)
    .populate({path :"reviews",populate: {path : "author"}})
    .populate("owner");
    // console.log(Listing);
     // If listing is not found
    if (!Listing) {
        req.flash("error","Listing you requested for does not exist");
        return res.redirect('/listings');
    }
    res.render("./listings/show.ejs",{Listing});
}

module.exports.createListings = async (req, res, next) => {
    const newListing = new listing(req.body.listing); // corrected variable name to be camelCase
    newListing.owner = req.user._id ;
    await newListing.save();
    req.flash("success","New listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const Listing = await listing.findById(id);
     // If listing is not found
     if (!Listing) {
        req.flash("error","Listing you requested for does not exist");
        return res.redirect('/listings');
    }
    req.flash("success","Listing Edit");

    res.render("./listings/edit.ejs",{Listing});
}

module.exports.updateListings = async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req,res) => {
    let {id} = req.params;
    const deleted = await listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}