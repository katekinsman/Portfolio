// fixr.js
// JavaScript for HW1: Fixr
// INFO 344A, Spring 2013
// Kate Kinsman


var SEARCHES;
var MAP;
var DESTINATION;
var MARKER;
var INFOWINDOW;

// When the page has finished loading, attach some event handlers.
$(document).ready(function() {
    initializeMap();
    loadCategories();

	$('#map').on('pageshow', function() {
		google.maps.event.trigger(MAP, 'resize'); // cause the map to refresh itself
		MAP.panTo(DESTINATION);                   // make sure it centers on the marker
	});
});

//loads the yelp search results for the given category
function loadResults(category){
    //changes title to include given category
    $('#results section h1').text('Fixr: ' + category);
    //requests results from the yelp proxy
    $.ajax('info344.ischool.uw.edu/yelp/yelp.php', {
        success: injectResults,
        error: ajaxError,
        data: SEARCHES[category]
    });
}

//injects the results for the category clicked on given the results from the ajax request
function injectResults(data){
    //if results already exist, delete them
    if($('#results-list ul li')){
        $('#results-list ul li').remove();
    }

    //loop over businesses to get info for results
    for(var i = 0; i < data.businesses.length; i++){
        var busInfo = data.businesses[i]
        var li = $('<li>')
        var a = $('<a>').attr('href', '#map').data('transition','slide');
        var address = $('<p>').addClass('ui-li-aside').html('' + busInfo.location.display_address[0] + '<br>'  + busInfo.location.display_address[2]);
        var img = $('<img>').attr('src', busInfo.image_url);
        var name = $('<h2>').text(busInfo.name);
        var stars = $('<p>').append($('<img>').attr({src: busInfo.rating_img_url, alt: busInfo.rating + 'stars on Yelp'}));
        li.append(a.append(address, img, name, stars));

        //attach click handler to result passing in the business info
        li.bind('click', {bus: busInfo}, (function(event){
            personalizeMap(event.data.bus);
        }));

        //attach info to page
        $('#results-list ul').append(li);
    }
    $('#results-list ul').listview('refresh');
}

//changes map to center on business given the business object and creates marker and info window for it
function personalizeMap(busInfo){
    //reset destination on the current business
    DESTINATION = new google.maps.LatLng(busInfo.location.coordinate.latitude, busInfo.location.coordinate.longitude);
    //put business name in title
    $('#map section h1').text('Fixr: ' + busInfo.name);

    //if a marker already exists, remove it from map
    if(MARKER){
        MARKER.setMap(null);
    }
    //create new marker on business
    MARKER = new google.maps.Marker({
        position: DESTINATION, // put at map's center point
        map: MAP,               // the map to put it in
        title: busInfo.name    // text of the tooltip when hovered over
    });

    //create content of info window to be businness info
    var windowContent = '<img src="' + busInfo.image_url + '" alt="Photo of' + busInfo.name + '"><p><h2>' +
        busInfo.name + '</h2>' + busInfo.location.display_address[0] + '<br>'  + busInfo.location.display_address[2] +
        '</p><p> Phone: ' + busInfo.display_phone + '</p><p><img src="' + busInfo.rating_img_url +
        '" alt="' + busInfo.rating + ' stars on Yelp"></p> <p>' + busInfo.review_count + ' ratings on Yelp</p>';
    //if info window alreay exists, remove it from map
    if(INFOWINDOW){
        INFOWINDOW.setMap(null);
    }
    //create new info window attached to marker with previously set content
    INFOWINDOW = new google.maps.InfoWindow({
        content: windowContent
    }).open(MAP, MARKER);
}

//populates the categories with data from the search settings
function loadCategories(){
    $.ajax('search_settings.json', {
        success: injectCategories,
        error: ajaxError,
        dataType: 'json'
    });
}

//injects the category data given the results from the ajax request
function injectCategories(data){
    SEARCHES = data;
    $.each(SEARCHES, function(key, value){
        var a = $('<a>').attr('href', '#results').text(key).data('transition','slide');
        var li = $('<li>');
        li.append(a);

        //attaches click handler to category that loads results given the category clicked on
        li.click(function(){
            loadResults(key);
        });
        $('#categories-list ul').append(li);

    });
    $('#categories-list ul').listview('refresh');
}

//creates a map
function initializeMap() {
    // an object that we'll use to specify options
    var mapOptions = {
        center: new google.maps.LatLng(47.53, -122.30),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    // the DOM object we're going to put the map into
    var mapElement = document.getElementById("map_container");
    // create the map inside mapElement with options specified by mapOptions
    MAP = new google.maps.Map(mapElement, mapOptions);
}


// Provided Ajax error handler function. (Attempts to display a useful debugging
// message.)
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
