var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/User.js');

router.get('/', function (req, res) {
		res.render('index', {
			user: req.user,
			});
});

router.get('/signup', function(req, res) {
		res.render('./users/signup', {title: 'SignUp'});
});

router.post('/signup', function(req, res) {
		User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
				if (err) {
					req.session.message.error.push('' + err);
					return res.render('./users/signup', { account: account });	
				}

				passport.authenticate('local')(req, res, function() {
					req.session.message.info.push('Signup success! Please login first!');
					res.redirect('/login');
				});
		});
});

router.get('/login', function(req, res, next) {
		res.render('./users/login', { user : req.user });
});

router.post('/login', passport.authenticate('local', {successRedirect: '/posts', failureFlash: 'Invalid username or password.'}), function(req, res) {

});

router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/posts');
});

/* GET /users/:id */
router.get('/user/:id', function(req, res, next) {
	User.findById(req.params.id, function (err, user) {
		if (err) return next(err);
		res.render('./users/view', {
			current_user: user,
			title: 'View Detail User',
			user: req.user
		});
	});
});

/*GET changeinfo */
router.get('/changeinfo/:id', function(req, res, next){
	User.findById(req.params.id, function(err, user){
		if(!user){
			return next(new Error('Not found this user!'));
		} else{
			res.render('./users/changeinfo', {
				title: 'Change User Info',
				user: user
			})
		}
	})
})


/* POST /changeinfo/ */
router.post('/changeinfo', function(req, res, next) {
	User.findById(req.user._id, function (err, user) {
		if(!user){
			console.log('Edit Fail');
			return next(new Error('Not found this user!'));
		} else{
			user.display_name = req.body.display_name
			user.save(function(err){
				if(err){
					//console.log('Error while saving user');
					req.session.message.error.push('Edit user failed. Please try again!');
					res.redirect('/changeinfo');
				} else{
					//console.log('Edit user success!');
					req.session.message.info.push('Edit user success!');
					res.redirect('/posts');
				}
			});
		} 
	});
});

/* DELETE /users/:id */
router.delete('/delete/:id', function(req, res, next) {
	User.findByIdAndRemove(req.params.id, req.body, function(err, user){
		//req.session.message.info.push('Delete user success!');
		res.send((err === null) ? {msg: ''} : {msg: 'Error' + err});
		//res.json(post);
	});
});

router.get('/userlist', function(req, res, next){
	User.find(function(err, users){
		if(err) return next(err);
		res.json(users);
	});
});

router.get('/manageraccount', function(req, res, next){
	res.render('./users/userlist', {
		title: 'Manager Account'
	});
});


module.exports = router;
