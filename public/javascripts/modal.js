/**
 * This class creates a modal messaging layer for the client display.
 */
function modal(message, buttons, callbacks) {
	
	var content = '<p>' + message + '</p>';
	
	if (buttons) {
		for (var i = 0; i < buttons.length; i++) {
		
			content += '<button id=\"' + buttons[i] + '\" class=\"avgrund-close\">' + buttons[i] + '</button>';
		}
	}
	
    // Configure the avgrund modal window layer
    $('#simulate').avgrund({
		height: 200,
		holderClass: 'custom',
		//showClose: true,
        //showCloseText: 'Close',
        closeByEscape: true,
        closeByDocument: false,
		enableStackAnimation: true,
		onBlurContainer: '.container',
        openOnEvent: false,
    	template: content,
	});
	
	if (buttons) {
		for (var i = 0; i < buttons.length; i++) {
		
			if (callbacks && callbacks[i]) {
				document.getElementById(buttons[i]).addEventListener('click', callbacks[i]);
			}
		}
	}
}
