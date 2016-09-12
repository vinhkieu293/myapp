module.exports = {
    isAuthorPost: function(req, res, next){
        if(req.user._id === req.body.author){
        	return next();
        } else{
        	req.session.message.error.push('Opps! You are not the author of the post');
        	res.redirect('back');
        }
    },

    isLogged: function(req, res, next){
    	if(req.isAuthenticated()){
    		return next();
    	} else{
    		req.session.message.error.push('Login to continue!');
    		res.redirect('/login');
    	}
    },

    isAuthorComment: function(req, res, next){
    	if(req.body.comments.user._id === req.user._id){
    		return next();
    	} else{
    		req.session.message.error.push('Opps! You are not the author of the comment');
    		res.redirect('back');
    	}
    }
};