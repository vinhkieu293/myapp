var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  display_name: {type: String, default: 'New User'},
  // admin: Boolean
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
