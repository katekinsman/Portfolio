// Skeleton JavaScript code for Lab 3: Twitter Service
// INFO 344 Spring 2013
// Morgan Doocy

// When the page has finished loading, fetch tweets and attach event handlers.
$(document).ready(function() {
	$('#tweet').click(submitTweet);
	
	fetchTweets(0);
});

function fetchTweets(latest_update) {
	$.ajax('twitter.php', {
		success: injectTweet,
		error: ajaxError,
		data: {newer_than: latest_update, 'for': 'morganiq'},
		type: 'GET',
		headers: {'Accept': 'application/json' }
	});
}

function injectTweet(data) {
	$.each(data, function(i, tweet){
        var li = $('<li>').text('id = ' + data[i].results.id + ', tweet is: ' + data[i].results.tweet + ', made at: ' + data[i].results.timestamp + 'from: ' + data[i].results.username);
		$('#timeline').prepend(li);
    });

    var timestamp = data.newest_record;
    fetchTweets(timestamp);
}


// Initiate an AJAX request to submit a new tweet to the web service.
function submitTweet() {
    var content = $('#content').val();
    $.ajax('twitter.php', {
        success: injectTweet,
        error: ajaxError,
        type: 'POST',
		data: {'tweet': content, username: 'morganiq'},
		headers: {'Accept': 'application/json' }
    });
}


// Provided Ajax error handler function (displays useful debugging information).
function ajaxError(jqxhr, type, error) {
	var msg = "An Ajax error occurred!\n\n";
	if (type == 'error') {
		if (jqxhr.readyState == 0) {
			// Request was never made - security block?
			msg += "Looks like the browser security-blocked the request.";
		} else {
			// Probably an HTTP error.
			msg += 'Error code: ' + jqxhr.status + "\n" + 
						 'Error text: ' + error + "\n" + 
						 'Full content of response: \n\n' + jqxhr.responseText;
		}
	} else {
		msg += 'Error type: ' + type;
		if (error != "") {
			msg += "\nError text: " + error;
		}
	}
	alert(msg);
}
