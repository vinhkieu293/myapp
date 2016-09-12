var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = mongoose.Schema({
    name: String
});
var postSchema = new Schema({
  title: { type: String, required: [true, 'Title cannot be blank']},
  content: {type: String, required:[true, 'Content cannot be blank']},
  author: { type : Schema.Types.ObjectId, ref : 'User' },
  tags: [tagSchema],
  create_date: { type: Date, default: Date.now },
  modified_date: { type: Date, default: Date.now },
  comments: [
	  {
	  	user: { type : Schema.Types.ObjectId, ref : 'User' },
	  	content: String,
	  	date_create: { type: Date, default: Date.now }
	  }
  ]
});



module.exports = mongoose.model('Post', postSchema);
