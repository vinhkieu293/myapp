var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = require('../models/Post.js');
var myfunc = require('./myfunc.js');

//Authenticated
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()){
        return next();
    } else{
        res.redirect('/posts');
    }
}
/*router.use(function(req, res, next){
    if(req.isAuthenticated()){
        console.log(req.user);
        return next();
    } else{
        res.redirect('/login');
    }
})*/
//GET Home page
router.get('/', function(req, res, next){
    Post.find({}).sort('-create_date').exec(function(err, posts){
        if(err) return next(err);
        res.render('./posts/index', {
            'posts': posts,
            title: 'Post Home',
            user: req.user
        });
    });
});

router.get('/data', function(req, res, next){
    Post.find(function(err, posts){
        if(err) return next(err);
        // user = req.user;
        res.json(posts);
    })
})

/* POST addpost Service */
router.post('/addpost', isAuthenticated, function(req, res) {

    // Set our internal DB variable
    if(req.body.title==='' && req.body.content===''){
        res.redirect("/posts/add");
        return false;
    } else{
        // Get our form values. These rely on the "name" attributes
        var new_title = req.body.title;
        //new_title = new_title.replace(/(?:\r\n|\r|\n)/g, '</br>');
        var new_content = req.body.content;
        //new_content = new_content.replace(/(?:\r\n|\r|\n)/g, '</br>');
        req.body.tags = req.body.tags.replace(/(?:\r\n|\r|\n)''/g).split(",").map(function(tag){
            return { "name": tag };
        });
        var author = {
            "user_id": req.user._id,
            "display_name": req.user.display_name
        };
        req.body.author = author;
        console.log(req.body);
        var newPost = new Post(req.body);
        newPost.save(function(err){
            if(err){
                res.send('Opps! Found Error. Please again!');
            } else{
                res.redirect('/posts');
            }
            
        });
    }
});

//GET addpost
router.get('/addpost', isAuthenticated,function(req, res){
    res.render('./posts/add',{
        title: 'Create New Post',
        user: req.user
    });

});
 

//GET View detail a post
router.get('/view/:id', function(req, res){
    Post.findById(req.params.id, function(err, post){
        res.render('./posts/view', {
            "post": post,
            title: 'Detail Post'
        });
    });
});

/* GET /posts/edit/:id */
router.get('/edit/:id', function(req, res, next) {
  Post.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.render('./posts/edit',{
        'post': post,
        title: 'Edit post' 
    });
  });
});

/* POST /posts/edit/:id */
router.post('/edit', function(req, res, next) {
  Post.findById(req.body.id, function(err, post){
    if(!post){
         return next(new Error('Not found this post!'));
    } else{
        post.title = req.body.title;
        post.content = req.body.content;
        post.modified_date = Date.now();
        post.save(function(err){
            if(err){
                console.log('Error');

            } else{
                console.log('Success');
                res.redirect('/posts');
            }
        });
    }
  });
});
/*
 * DELETE to deletePost.
 */
router.delete('/delete/:id', isAuthenticated,function(req, res, next) {
    /*Post.findById(req.params.id, function(err, post){
        if(!post){
            return next(new Error('Not Found this post! Try again'));
        } else{
            if(myfunc.is_author(post.author.user_id, req.user._id)){*/
                Post.findByIdAndRemove(req.params.id, req.body, function(err, post){
                    res.send((err === null) ? {msg: ''} : {msg: 'Error' + err})
                    console.log("Delete success");
                /*});
            } else{
                console.log('Delete faile');
            }
        }*/
    });

    
});

module.exports = router;