"use strict"
const express     = require("express");
const bodyParser  = require("body-parser");
const app         = express();
const port        = process.env.PORT || 3000;
const dotenv      = require("dotenv");
const helmet      = require('helmet');
const frameguard  = require('frameguard');
const session     = require( 'express-session' ) ;
const mongoose    = require("mongoose");
const Campground  = require("./models/campground");
const Comment     = require("./models/comment");
const seedDb      = require("./seeds");

seedDb();
app.use(helmet());
app.disable('x-powered-by');
app.use(frameguard({ action: 'deny' }));
app.use(bodyParser.urlencoded({extended:true}));

app.use( session( {
  secret: 'AreallyLong-6^#FhF(53NGGFcasBA-secret-key-goes-HERE4NOw',
  key: 'sessionid',
  saveUninitialized: false,
  resave: false
} ) ) ;

// dotenv testing
const { error } = dotenv.config();
if (error) {
  throw error
};

//connect mongoose to the MongoDB. If it doesnt exist MongoDB creates the yelp_camp DB.
mongoose.connect("mongodb://localhost:27017/yelp_camp");


// Template engine set up
app.set("view engine", "ejs");

//use middle ware to serve dist
app.use(express.static("dist/css"));

app.get('/', (req, res) => {
    res.render("landing");
});
//Index route to SHOW all campgrounds
//Get and render images in campgrounds page
 app.get("/campgrounds", (req, res) => {
// Get all the campgrounds from mongodb
   Campground.find({}, function(err, allCampgrounds) {
     if(err) {
       console.log(err);
     } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
     }
   });
 });

//Create route adds new campground to mongodb
 app.post("/campgrounds", (req, res) => {
   // get data from form
   let name = req.body.name;
   let image = req.body.image;
   let desc = req.body.description;
   const newCampground = {name: name, image: image, description: desc}
//   create a new campground Then redirect back to (index)campgrounds page
   Campground.create(newCampground, function(err, newlyCreated) {
     if(err) {
       console.log(err);
     } else {
       //redirect back to (index)campgrounds view
       res.redirect("/campgrounds");
     }
   });
 });
//NEW route Show form to create a new campground
 app.get("/campgrounds/new", (req, res) => {
   res.render("campgrounds/new");
 });

//find the campground with provided id
//then (SHOW) template with that campground
 app.get("/campgrounds/:id", function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
     if(err){
       console.log(err);
     } else {
       console.log(foundCampground);
       // render show template with that campground
       res.render("campgrounds/show", {campground: foundCampground});
     }
   });
 });

 //===========================================================
 // *********** COMMENTS ROUTES ******************************
 //===========================================================

 app.get("/campgrounds/:id/comments/new", function(req, res){
   // find campground by id
   Campground.findById(req.params.id, function(err, campground){
     if(err){
       console.log(err);
     } else {
       res.render("comments/new", {campground: campground});
     }
   })
  //  res.render("comments/new");
 });

 app.post("/campgrounds/:id/comments", function(req, res){
   //lookup campground using ID.
   Campground.findById(req.params.id, function(err, campground){
     if(err){
       console.log(err);
       res.redirect("/campgrounds");
     } else {
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
          } else {
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
          }
        });
     }
   });
   // Create new comment, connect new comment to campground
   //redirect to show page
 });

//Get and send page not found
app.get('*', (req, res) => {
    res.send('<h1>404 page not found</h1>');
});

//Setup port
app.listen(port, () => {
    console.log(`Yelp Camp Server is running on port ${port}.`);
});
