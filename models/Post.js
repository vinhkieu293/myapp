var mongoose = require('mongoose');

var tagSchema = mongoose.Schema({
    name: String
});
var postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    user_id: String,
    display_name: String
  },
  tags: [tagSchema],
  create_date: { type: Date, default: Date.now },
  modified_date: { type: Date, default: Date.now },
  comments: [
	  {
	  	user_id: String,
      display_name: String,
	  	content: String,
	  	date_create: {type: Date, default: Date.now }
	  }
  ]
});
module.exports = mongoose.model('Post', postSchema);
