const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const sessionOptions = {
    secret:"mcode",
    resave : false,
    saveUninitialized : true,
};

app.use(session(sessionOptions));
app.use(flash());
app.set("view engine","ejs");
app.set("views" , path.join(__dirname,"views"));

app.use((req,res,next) => {
    res.locals.sucMsg = req.flash("success");
    res.locals.errMsg = req.flash("err");
    next();
});


app.get('/getreqcount',(req,res) => {
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`U sent ${req.session.count} times req to sever`);
})

app.get("/register",(req,res) => {
    const {name = "anonymous"} = req.query;
    req.session.name = name;
    if(req.session.name == "anonymous"){
        req.flash("err","User Not register succesfully");
    }else{
        req.flash("success","User register succesfully");
    }
    res.redirect("/hello");
});

app.get('/hello',(req,res) => {
    res.render('page.ejs',{name:req.session.name});
});

app.listen(3000, ()=> {
    console.log("app listening port 3000");
});
// const users = require("./routes/user.js");
// const cookieParser = require("cookie-parser");

// app.use("/users",users);
// app.use(cookieParser("SecretCode"));

// app.get('/getCookies' , (req,res) => {
//     res.cookie("chudary","taimoor");
//     res.cookie("name","Taimoor Khan",{signed : true});
//     res.send("get cookie for user");
// });

// app.get('/',(req,res) => {
//     console.log(req.signedCookies);
//     res.send(`HI`);
// });