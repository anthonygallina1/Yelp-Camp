'use strict';
const mongoose = require("mongoose")
const postSchema = new.mongoose.Schema({
  title: String,
  content: String
});
let module.exports = mongoose.model("User", userSchema);
