'use strict';

const mongoose   = require("mongoose");
const Campground = require("./models/campground");
const Comment    = require("./models/comment");

const data = [
  {
    name: "Alps Campground",
    image: "https://s26.postimg.cc/iad4b6qh5/CCOlic_Sagui_Andrea.jpg",
    description: "Within easy reach of the greater Los Angeles area, Alps Campground is a quiet haven."
  },
  {
    name: "O'Neill Regional Park",
    image: "https://s26.postimg.cc/dbplwmzix/CCOlic_Jens_Mahnke.jpg",
    description: " The park is heavily wooded with coast live oak and sycamore trees."
  },
  {
    name: "Orange Campground",
    image: "https://s26.postimg.cc/5iyy4o19l/CCOlic_Miro_Alt.jpg",
    description: "Love this beautiful Wilderness area. And this place is very mountain bike friendly. "
  }
  ]

function seedDB(){
  //Remove all campgrounds from yelp_camp
  Campground.remove({}, function(err) {
    if(err){
      console.log("err");
    }
    console.log("REMOVED campgrounds");
    //add a few campgrounds
    data.forEach(function(seed){
      Campground.create(seed, function(err, campground){
        if(err){
          console.log(err);
        } else {
          console.log("added a campground");
          Comment.create(
            {
              text: "This place is great! But I wish there was internet.",
              author: "Homer"
            }, function(err, comment){
              if (err){
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("CREATED new comment");
              }
            });
        }
      })
    });
  });
//  Campground.create({})
  //add a few comments
}

module.exports = seedDB;
