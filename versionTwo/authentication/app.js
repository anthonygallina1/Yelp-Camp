'use strict';
const dotenv        = require('dotenv').config();
const port          = process.env.PORT;
const host          = process.env.HOST;
const secret        = process.env.SECRET;
const mongoose      = require('mongoose');
const express       = require("express");
const helmet        = require("helmet");
const frameguard    = require("frameguard");
const passport      = require("passport");
const bodyParser    = require("body-parser");
const User          = require("./models/user");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const app           = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(frameguard({ action: 'deny'}));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/auth_demo_app");

app.set('view engine', 'ejs');

//use secret hash in .env
app.use(require("express-session")({
  secret: '${secret}',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =======================================================
//                       ROUTES
// =======================================================
app.get("/", function(req, res){
  res.render("home");
});


app.get("/secret", isLoggedIn, function(req, res){
  res.render("secret");
});

// =======================================================
//                       AUTH-ROUTES
// =======================================================

// show sign up form
app.get("/register", function(req, res){
  res.render("register");
});


//handles user sign up
app.post("/register", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    });
  });
});

// =======================================================
//                       LOGIN-ROUTES
// =======================================================

//render login form
app.get("/login", function(req, res){
  res.render("login");
});

//login logic
//middleware
app.post("/login",passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//TEST FOR AVAILABLE ENVIRONMENT IN ----- dotenv env file DEV only
//console.log(process.env);

app.listen(port, () => {
    console.log(`AuthDemo is running on ${host},Port ${port}.`);
});
