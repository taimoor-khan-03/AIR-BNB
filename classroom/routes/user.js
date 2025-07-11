const express = require("express");
const router = express.Router();

// Index
router.get("/" , (req,res) => {
    res.send("GET for users");
})

//Show
router.get("/:id", (req,res) => {
    res.send("GET for users id");
})
//edit
router.post("/:id",(req,res) => {
    res.send("POST for new users");
})
//Delete
router.delete("/:id",(req,res) => {
    res.send("Delete for users");
})

module.exports = router ;