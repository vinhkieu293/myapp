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
    res.render('./users/signup', {title: 'Register'});
});

router.post('/signup', function(req, res) {
    User.register(new User({ username : req.body.username }, {display_name : req.body.display_name}), req.body.password, function(err, account) {
        if (err) {
            return res.render('./users/signup', { account: account });
            console.log('Error found');
        }

        passport.authenticate('local')(req, res, function() {
            res.redirect('/login');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('./users/login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/posts');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/posts');
});







router.get('/add', function(req, res, next){
	res.render('./users/add', {
		title: 'Add User'
	});
})
/* POST /users/ */
router.post('/add', function(req, res, next){
	User.create(req.body, function (err, post){
		if(err) return next(err);
		res.json(post);
	});
});
/* GET /users/:id */
router.get('/user/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);
    res.render('./users/view', {
      user: user,
      title: 'View Detail User'
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
          console.log('Error while saving user');
        } else{
          console.log('Edit user success!');
          res.redirect('/posts');
        }
      });
    } 
  });
});

/* DELETE /users/:id */
router.delete('/delete/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) return next(err);
    //res.json(post);
  });
});


module.exports = router;
