'use strict';

'use strict';
const mongoose = require("mongoose")
const postSchema = new.mongoose.Schema({
  title: String,
  content: String
});
let module.exports = mongoose.model("Post", postSchema);
