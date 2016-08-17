// Userlist data array for filling in info box
var myData = [];

// DOM Ready =============================================================
$(document).ready(function() {
	// Username link click
	$('#postList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	// Populate the user table on initial page load
	populateTable();
	// Add User button click
	$('#btncreatePost').on('click', createPost);
	// Delete User link click
    $('table tbody').on('click', 'td a.btn.btn-danger', deletePost);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON('/posts/postlist', function(data) {
		// Stick our user data array into a userlist variable in the global object
		myData = data;
		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
			tableContent += '<a href="/posts/' + this._id + '">' + this.title + '</a></br>';
		});

		// Inject the whole content string into our existing HTML table
		$('#postList').html(tableContent);
	});
};

// Show User Info
function showUserInfo(event) {

	// Prevent Link from Firing
	event.preventDefault();

	// Retrieve username from link rel attribute
	var thisUserName = $(this).attr('rel');

	// Get Index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

	// Get our User Object
	var thisUserObject = userListData[arrayPosition];

	//Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function createPost(event) {
	event.preventDefault();

	// Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#createPost input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});

	// Check and make sure errorCount's still at zero
	if(errorCount === 0) {

		// If it is, compile all user info into one object
		var newpost = {
			'title': $('#createPost input#titlePost').val(),
			'content': $('#createPost textarea#contentPost').val().replace(/\n/g, '<br/>')
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newpost,
			url: '/posts/addpost',
			dataType: 'JSON'
		}).done(function( response ) {

			// Check for successful (blank) response
			if (response.msg === '') {

				// Clear the form inputs
				$('#createPost input').val('');
				$('#createPost textarea').val('');

				// Update the table
				populateTable();

			}
			else {

				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);

			}
		});
	}
	else {
		// If errorCount is more than 0, error out
		alert('Vui lòng điền đầy đủ các trường');
		return false;
	}
};

// Delete User
function deletePost(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/posts/deletepost/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {

            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            //populateTable();
            location.href = "localhost:3000/posts"

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};