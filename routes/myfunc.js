module.exports = {
    is_author: function(user_id, author_id){
        if(user_id == author_id){
            return true;
        } else{
            return false;
        }
    }
};