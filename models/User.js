var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var userSchema = new mongoose.Schema({
  username: {type: String, required:[true, 'Username cannot be blank']},
  password: {type: String, required:[true, 'Password cannot be blank']},
  display_name: {type: String, default: 'New User'},
  // admin: Boolean
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
