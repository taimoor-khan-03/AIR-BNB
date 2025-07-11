const  mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new schema({
  title:{
    type:String,
    required:true
  },  
  description:{
    type:String,
    required:true
  }, 
  image:{
    url: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9vYX",
      },
    filename: String,
  }, 
  reviews : [ 
    {
    type : schema.Types.ObjectId,
    ref : "Review"
    },
  ],
  owner : {
    type : schema.Types.ObjectId,
    ref : "User"
  },
  price :Number, 
  location:String,  
  country:String, 
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
  }
})

let listing = mongoose.model("listing",listingSchema);
module.exports = listing;