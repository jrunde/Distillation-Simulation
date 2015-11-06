/**
 * This class creates a modal messaging layer for the client display.
 */
function modal(message, buttons, callbacks) {
	
	var content = '<p>' + message + '</p>';
	
	// Create the button elements for the pop-up window
	if (buttons) {
		
		content += '<br/>';
		for (var i = 0; i < buttons.length; i++) {
		
			content += '<button id=\"' + buttons[i] + '\" class=\"avgrund-close\">' +
				buttons[i] + '</button>';
			content += '<div class="divider"/>';
		}
	}
	
    // Configure the avgrund modal window layer
    var obj = $('#simulate').avgrund({
		height: 200,
		holderClass: 'custom',
        closeByEscape: false,
        closeByDocument: false,
		enableStackAnimation: true,
		onBlurContainer: '.container',
        openOnEvent: false,
    	template: content,
	});
	
	// Create callbacks for the buttons
	if (buttons) {
		for (var i = 0; i < buttons.length; i++) {
		
			if (callbacks && callbacks[i]) {
				document.getElementById(buttons[i]).addEventListener('click', callbacks[i]);
			}
		}
	}
	
	/**
 	 * Removes the modal message.
     */
	this.destroy = function() {
            
		document.body.className = "avgrund-ready";
	}
}
