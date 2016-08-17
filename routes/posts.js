var express = require('express');
var router = express.Router();
//GET Home page
router.get('/', function(req, res, next){
	var db = req.db;
	var collection = db.get('posts');
	collection.find({}, {}, function(e, docs){
		res.render('./posts/index', {
			"posts" : docs
		});
	});
});

/* POST to Add Post Service */
router.post('/addpost', function(req, res) {

    // Set our internal DB variable
    var db = req.db;
    var error = 0;
    if(req.body.title==='' && req.body.content===''){
        res.redirect("/posts/add");
        return false;
    } else{
        // Get our form values. These rely on the "name" attributes
        var title = req.body.title;
        var content = req.body.content;
        // Set our collection
        var collection = db.get('posts');

        // Submit to the DB
        collection.insert({
            "title" : title,
            "content" : content
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("Có lỗi xảy ra. Vui lòng thử lại");
            }
            else {
                // And forward to success page
                res.redirect("/posts/");
            }
        });
    }
});
/*
 * GET postlist.
 */
router.get('/postlist', function(req, res) {
	var db = req.db;
	var collection = db.get('posts');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

//GET Add post
router.get('/add', function(req, res){
    res.render('./posts/add',{title: 'Create New Post'});

})
/*
 * POST to addpost.
 */
router.post('/addpost', function(req, res) {
    var db = req.db;
    var collection = db.get('posts');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//GET View detail a post
router.get('/view/:id', function(req, res){
    var db = req.db;
    var collection = db.get('posts');
    collection.findOne({_id : req.params.id}, {}, function(e, docs){
        res.render('./posts/view', {
            "post": docs
        });
    });
});


/*
 * DELETE to deletePost.
 */
router.delete('/deletepost/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('posts');
    var postToDelete = req.params.id;
    collection.remove({ '_id' : postToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});
module.exports = router;