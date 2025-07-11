const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const {validateReview, isLogged , isAuthor} = require("../routes/middleware.js");
const reviewController = require("../controllers/review.js");


router.post("/",
validateReview, 
wrapAsync(reviewController.createReview));


router.delete("/:reviewId", 
isLogged , 
isAuthor ,
wrapAsync(reviewController.destroyReview));

module.exports = router;