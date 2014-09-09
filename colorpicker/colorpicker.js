/*
colorpicker.js
Javascript file for mini-project
INFO 343 Autumn 2012
Kate Kinsman
Ashley Retzlaff */


// Displays the color of the swatches
function displayColor(box) {
    //creates new color object
    var newColor = new Color();

    if (box == 'r' || box == 'g' || box == 'b') {
		//sets RGB values
        var r = $('#r').slider("option", "value");
        var g = $('#g').slider("option", "value");
        var b = $('#b').slider("option", "value");
		newColor.setRGB(r, g, b);
    } else {
		//sets Hex value
		newColor.setHex($('#hexnumber').val());
    }

    //
    updateBoxes(newColor);

	// Adds text that displays the RGB and hex numbers of the main swatch
    var colorString = "rgb(" + newColor.r + "," + newColor.g + "," + newColor.b + ")";
    $('#mainswatch div p.black, #mainswatch div p.white').text(colorString + ' OR ' + newColor.hex);
	
	// Changes color of all swatches
    injectMain(colorString);
    injectSwatches(newColor, colorString);

	// Changes text color of swatch text
	$('.black').css('color', 'black').css('text-align', 'center');
	$('.white').css('color', 'white').css('text-align', 'center');
}

// Updates the values R, G, B sliders and Hex box according to the parameterized new color
function updateBoxes(newColor){
    $('#r').slider("option", "value", newColor.r);
    $('#g').slider("option", "value", newColor.g);
    $('#b').slider("option", "value", newColor.b);
    $('#hexnumber').val(newColor.hex)
}

// Injects the new color into the main swatch according to an parameterized color string
function injectMain(colorString) {
	$('#mainswatch div').css('background-color', colorString);
}

// Injects variant colors and their corresponding hex and RGB into secondary swatches
// Updates the colors on the preview site
function injectSwatches(newColor, colorString) {
    var variant1 = new Color();
    var variant2 = new Color();
    var variant3 = new Color();

	// Sets HSL of variants, changes the swatches to variant color, and adds text that displays the RGB and hex numbers
	//of the variants
	for(var i = 1; i < 4; i++) {
		var multiplier = (22.5 * i);
		
		if (i == 1) {
			if (newColor.h + multiplier > 360) {
				variant1.setHSL(newColor.h + multiplier - 360, newColor.s, newColor.l);
			} else {
				variant1.setHSL(newColor.h + multiplier, newColor.s, newColor.l);
			}

            var variantString1 = "rgb(" + variant1.r + "," + variant1.g + "," + variant1.b + ")";
            $('p.black, p.white', '#1').text(variantString1 + ' OR ' + variant1.hex);
            //newSwatch
            $('#1').css('background-color', variantString1);

		} else if (i == 2) {
			if (newColor.h + multiplier > 360) {
				variant2.setHSL(newColor.h + multiplier - 360, newColor.s, newColor.l);
			} else {
				variant2.setHSL(newColor.h + multiplier, newColor.s, newColor.l);
			}

            var variantString2 = "rgb(" + variant2.r + "," + variant2.g + "," + variant2.b + ")";
            $('p.black, p.white', '#2').text(variantString2 + ' OR ' + variant2.hex);
            //newSwatch
            $('#2').css('background-color', variantString2);

		} else {
			if (newColor.h + multiplier > 360) {
				variant3.setHSL(newColor.h + multiplier - 360, newColor.s, newColor.l);

			} else {
				variant3.setHSL(newColor.h + multiplier, newColor.s, newColor.l);
			}

            var variantString3 = "rgb(" + variant3.r + "," + variant3.g + "," + variant3.b + ")";
            $('p.black, p.white', '#3').text(variantString3 + ' OR ' + variant3.hex);
            //newSwatch
            $('#3').css('background-color', variantString3);
		}
	}
	
	// Updates the colors on the preview page
	$('#header, #footer').css('background-color', variantString3);
	$('#preview').css('background-color', colorString);
	$('#preview section').css('background-color', variantString2);
	$('#preview aside').css('background-color', variantString1);
}

$(document).ready(function () {

    $('#r, #g, #b').slider({value: 0, min:0, max:255, animate:true});
    displayColor();
    //$('#hexnumber').change(displayColor('hex'));
    $('#r, #g, #b').slider({
        "change": function(event, ui){
            displayColor(this.id);
        }
    });

	// Controls the dialog Jquery UI function
	$(function() {
        $('.simple_overlay').dialog({
            autoOpen: false,
            show: "blind",
            hide: "blind",
			width: 65 * 16,
			height:66 * 16,
			resizable: false
        });
        $('#button').click(function() {
            $('.simple_overlay').dialog("open");
            return false;
        });
    });
});