/* Janella Ignacio
   Kate Kinsman
   Ashley Retzlaff
   INFO 343C Final Project */
   
/* TO DO:
	make a map my itinerary?
		problem is address isn't always reliable
		perhaps make avaialable only if address?
	responsive design
		web
		tablet
		mobile
*/
   
   
   

/*var CENTER = {
	lat: 47.6097,
	lng: -122.3331
}

var MAP;*/

// When the document's ready, attach a click handler to the 'fetch' button and inject a Google Map
$(document).ready(function() {
	$('#text').click(enterText).keyup(function(event){
		if(event.keyCode == 13){
			$("#submit").click();
		}
	});
	$('#submit').click(fetchEvent).click(fetchRestaurant);
	//$('#submit').click(fetchRestaurant);
	//initializeMap();
	populateTabs();
});

function populateTabs(){
	$('#tabs-1').append($('<p>').append('Submit your zipcode to view events in your area!'));
	$('#tabs-2').append($('<p>').append('Submit your zipcode to view restaurants in your area!'));
	$('#tabs-3').append($('<p>').append('You have not added any items to your itinerary.'));
}

// Clears the text in the text box
function enterText() {
	$('#text').val("");
}

/*// Injects a Google Map to the page
function initializeMap() {
	var coords = new google.maps.LatLng(CENTER.lat, CENTER.lng);
	
	var mapOptions = {
		center: coords,
		zoom: 6,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	
	var mapElement = document.getElementById('map_container');
	MAP = new google.maps.Map(mapElement, mapOptions);
	
	var $p = $('<p>').text('Seeeattle');
	var dom_p = $p[0];
	var tooltip = 'You are here!';
	
	createMarker(coords, dom_p, tooltip);
}

// Adds a marker to the Google Map
function createMarker (coords, dom_p, tooltip) {
	var marker = new google.maps.Marker({
		position: coords,
		map: MAP,
		title: tooltip
	});
	
	var infowindow = new google.maps.InfoWindow({
		content: dom_p
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(MAP,marker);
	});
}*/

//var PARAMETER = null;
// Handle clicking on the "submit" button 
function fetchEvent() {
	var input = $('#text').val();
	
	$.ajax('http://api.eventful.com/json/events/search?', {
		data: { 
			location: input,
			app_key: 's5TgZMD9WFvVRCP3'
		},
		dataType: 'jsonp',
		success: injectEvent,
		error: ajaxError
	});
}

// Injects data into the page
function injectEvent(data) {
	if ($('#tabs-1 p')){
		$('#tabs-1 p').remove();
	}
	if ($('#events')) {
		$('#events').remove();
	}
	$('#tabs-1').append($('<div>').attr('id', 'events'));
	
	if (data.events == null) {
		$('<p>').text('There are no events in your area.').appendTo($('#events'));
	} else {
		for (var i = 0; i < data.events.event.length; i++) {
			var list = $('<ul>').addClass('list');
			var div = $('<div>');
			var event = $('<h3>').text(data.events.event[i].title);
			var venue= $('<li>').append($('<a>').attr('href', data.events.event[i].venue_url).text(data.events.event[i].venue_name));
			if (data.events.event[i].image) {
				var image = $('<img>', { src: data.events.event[i].image.medium.url, alt: 'img' });
			}
			if (data.events.event[i].venue_address) {
				var address = $('<li>').text(data.events.event[i].venue_address);
			}
			var time = data.events.event[i].start_time.toString();
			var conTime = $('<li>').text(convertTime(time));
			var button = $('<li>').append($('<button/>', {
				text: 'Add to Itinerary',
				id: i,
				click: updateItinerary
			}));
			list.append(venue);
			list.append(address);
			list.append(conTime);
			list.append(button);
			div.append(image);
			div.append(list);

			
			var group = $('<div>').addClass('group');
			group.append(event, div);
			group.appendTo($('#events'));
		}	
		
		$( "#events" ).accordion({
			header: "> div > h3",
			heightStyle: "content"
		}).sortable({
			axis: "y",
			handle: "h3",
			stop: function( event, ui ) {
				// IE doesn't register the blur when sorting
				// so trigger focusout handlers to remove .ui-state-focus
				ui.item.children( "h3" ).triggerHandler( "focusout" );
			}
		});	
	}	
}		    

function convertTime(time){

	var aTime = time.split(' ');
	
	var date = aTime[0].split('-');
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var monthString = '' + months[date[1] - 1] + ' ' + date[2] + ', ' + date[0];

	var btime = aTime[1].split(':');
	var stamp = 'AM';
	hour = btime[0]
	if(hour > 12){
		stamp = 'PM'
		hour = parseInt(btime[0]) - 12;
	}
	var timeString = '' + hour + ':' + btime[1] + stamp;
	var fin = monthString + ' at ' + timeString;
	return fin;
}

function fetchRestaurant() {
	var input = $('#text').val();
		
	$.ajax('//info343.ischool.uw.edu/proxy.php', {
		data: {
			_service_: 'http://opentable.heroku.com/api/restaurants',
			zip: input
		},
		success: injectRestaurant,
		error: ajaxError
	});
}

function injectRestaurant(data) {
	if ($('#tabs-2 p')){
		$('#tabs-2 p').remove();
	}
	
	if ($('#restaurants')) {
		$('#restaurants').remove();
	}
	
	$('#tabs-2').append($('<div>').attr('id', 'restaurants'));
	
	if (data.restaurants == null) {
		$('<p>').text('There are no restaurants in your area.').appendTo($('#restaurants'));
	} else {
		for (var i = 0; i < data.restaurants.length; i++) {
			var list = $('<ul>').addClass('list');
			var div = $('<div>');
			var name = $('<h3>').text(data.restaurants[i].name);
			var reserve= $('<li>').append($('<a>').attr('href', data.restaurants[i].reserve_url).text('Reserve Now!'));
			if (data.restaurants[i].address) {
				var address = $('<li>').text(data.restaurants[i].address);
			}
			var phone = $('<li>').text(data.restaurants[i].phone);
			var button = $('<li>').append($('<button/>', {
				text: 'Add to Itinerary',
				id: i,
				click: updateItinerary
			}));
			
			
			list.append(address);
			list.append(reserve);
			list.append(phone);
			list.append(button);
			div.append(list);
			
			var group = $('<div>').addClass('group');
			group.append(name, div);
			group.appendTo($('#restaurants'));
		}	
		
		$( "#restaurants" ).accordion({
			header: "> div > h3",
			heightStyle: "content"
		}).sortable({
			axis: "y",
			handle: "h3",
			stop: function( event, ui ) {
				ui.item.children( "h3" ).triggerHandler( "focusout" );
			}
		});	
	}	
}


$(function() {
	$("#tabs").tabs();
});
var TABNAME;
function updateItinerary() {
	if ($('#tabs-3 p')){
		$('#tabs-3 p').remove();
	}
	TABNAME= $(this).parent().parent().parent().parent().parent().attr('id');

	var group = $('<div>').addClass('group');
	group.append($('#ui-accordion-' + TABNAME + '-header-' + this.id), $('#ui-accordion-' + TABNAME + '-panel-' + this.id));
	group.appendTo($('#itinerary'));
	
	$('#ui-accordion-' + TABNAME + '-panel-' + this.id + ' #' + this.id).remove();
	
	var button = $('<li>').append($('<button/>', {
		text: 'Remove from Itinerary',
		id: this.id,
		click: removeItinerary
	}));
	
	$('#ui-accordion-' + TABNAME + '-panel-' + this.id  + ' ul').append(button);	
	
	$( "#itinerary" ).accordion({
			header: "> div > h3",
			heightStyle: "content"
		}).sortable({
			axis: "y",
			handle: "h3",
			stop: function( event, ui ) {
				ui.item.children( "h3" ).triggerHandler( "focusout" );
			}
		});	
}

function removeItinerary(){
	var temp= $(this).parent().parent().parent().attr('id');
	if (temp == "ui-accordion-events-panel-" + this.id) {
		TABNAME = 'events';
	}	else {
		TABNAME = 'restaurants';
	}

	var group = $('<div>').addClass('group');
	group.append($('#ui-accordion-' + TABNAME + '-header-' + this.id), $('#ui-accordion-' + TABNAME + '-panel-' + this.id));
	group.appendTo($('#' + TABNAME));
	
	$('#ui-accordion-' + TABNAME + '-panel-' + this.id + ' ul li:last-child').remove();
	var button = $('<li>').append($('<button/>', {
		text: 'Add to Itinerary',
		id: this.id,
		click: updateItinerary
	}));

	$('#ui-accordion-' + TABNAME + '-panel-' + this.id + ' ul').append(button);
}

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