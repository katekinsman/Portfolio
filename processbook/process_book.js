/*
process_book.js
Javascript file for process book
INFO 360 Autumn 2012
Kate Kinsman
*/

var SECTION = 1;

function getPrevious(){
    if(SECTION == 1){
        SECTION = 11;
    }else{
        SECTION --;
    }

    var file = 's' + SECTION + '.html';
    if(SECTION < 12){
        $.ajax(file, {
            success: injectPrevious,
            error: ajaxError
        })
    }
}

function getNext(){
    if(SECTION == 11){
        SECTION = 1;
    }else{
        SECTION ++;
    }
    var file = 's' + SECTION + '.html';
    if(SECTION < 12){
        $.ajax(file, {
            success: injectNext,
            error: ajaxError
        })
    }
}

function injectNext(data){
    var newSection = $('<div>', {'id': 'desc'}).html(data);
    $('#desc').replaceWith(newSection);
}
function injectPrevious(data){
    var newSection = $('<div>', {'id': 'desc'}).html(data);
    $('#desc').replaceWith(newSection);
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

var slideCount = $('#sliderul .sliderli').length;
var slideWidth = $('#sliderul .sliderli').width();
var slideHeight = $('#sliderul .sliderli').height();
var sliderUlWidth = slideCount * slideWidth;

$('#slider').css({ width: slideWidth, height: slideHeight });

$('#sliderul').css({ width: sliderUlWidth, marginLeft: - slideWidth });

$('#sliderul .sliderli:last-child').prependTo('#sliderul');

function moveLeft() {
    $('#sliderul').animate({
        left: + slideWidth
    }, 200, function () {
        $('#sliderul .sliderli:last-child').prependTo('#sliderul');
        $('#sliderul').css('left', '');
    });
    getPrevious();
};

function moveRight() {
    $('#sliderul').animate({
        left: - slideWidth
    }, 200, function () {
        $('#sliderul .sliderli:first-child').appendTo('#sliderul');
        $('#sliderul').css('left', '');
    });
    getNext();
};

$(document).ready(function(){
//    $('button').click(getNext);
    $.ajax('s1.html', {
        success: injectNext,
        error: ajaxError
    })
    $('a.control_prev').click(function () {
        moveLeft();
    });

    $('a.control_next').click(function () {
        moveRight();
    });
});