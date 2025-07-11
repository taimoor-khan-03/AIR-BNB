const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const  passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
 
const sessionOptions = {
    secret : "mysecretsupercode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge : 7 * 24 * 60 * 60 * 1000 ,
        httpOnly : true
    }
}


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";              

main().then(() => {
    console.log("connected to DB");
}).catch(err =>  {
    console.log(err)
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success   = req.flash("success");
    res.locals.error   = req.flash("error");
    res.locals.currUser = req.user ;
    next();
});

// demo user
// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User({
//         email : "buny@gmail.com",
//         username : "default-user"
//     });

//     let registeredUser = await User.register(fakeUser,"123444");
//     res.send(registeredUser);
// });

//Post's

app.use("/listings",listingRouter);

// Review's 

app.use("/listings/:id/reviews", reviewRouter);

// User's

app.use("/",userRouter);

// Error handler's

app.all(/.*/, (req, res, next) => {
    console.log("404 for:", req.originalUrl); // add this line
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    console.log(err);
    res.render("Error.ejs",{err});
});


app.listen("8080",() => {
    console.log("app listening port : 8080");
});            



// app.use((err,req,res,next) => {
//     let {status = 500 , message = "some went wrong"} = err;
//     res.status(status).render("Error.ejs",{message});
// });

// app.get("/",(req,res) =>{ 
//     res.send("HI , I AM ROOT.");
// }); error gives