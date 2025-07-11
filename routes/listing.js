const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const {isLogged , isOwner , validateListing} = require("../routes/middleware.js");
const listingsController = require("../controllers/listings.js");

// index & create route
router.route("/")
.get(wrapAsync( listingsController.index ))
.post( 
isLogged , 
validateListing , 
wrapAsync(listingsController.createListings));

// NEW ROUTE
router.get("/new",isLogged , listingsController.renderNewForm);

//SHOW , UPDATE & DELETE ROUTE 
router.route("/:id")
.get(wrapAsync(listingsController.showListings))
.put(
isLogged , 
isOwner , 
wrapAsync(listingsController.updateListings))
.delete(
isLogged , 
isOwner , 
wrapAsync(listingsController.destroyListings));

// EDIT ROUTE
router.get("/:id/edit",
isLogged ,
isOwner , 
wrapAsync(listingsController.renderEditForm));

module.exports = router ;