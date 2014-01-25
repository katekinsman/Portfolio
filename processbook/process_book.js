/*
process_book.js
Javascript file for process book
INFO 360 Autumn 2012
Kate Kinsman
*/

var SECTION= 1;

function getNext(){
    SECTION ++;
    var file = 's' + SECTION + '.html';
    if(SECTION < 12){
        $.ajax(file, {
            success: injectNext,
            error: ajaxError
        })
    }
    if(SECTION > 10){
        $('a').remove();
    }
}

function injectNext(data){
    var newSection = $('<div>', {'id': SECTION}).html(data);
    $('#content').append(newSection);
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

$(document).ready(function(){
    $('button').click(getNext);
});