/**
 * This class creates a modal messaging layer for the client display.
 */
function modal(message, buttons, callbacks, unclosable) {
	
	var me = this;
	var content = '<p>' + message + '</p>';
	var obj;
	
	// Create the button elements for the pop-up window
	if (buttons) {
		
		content += '<br/>';
		for (var i = 0; i < buttons.length; i++) {
		
			content += '<button id=\"' + buttons[i] + '\" ';
			if (!unclosable) content += 'class=\"avgrund-close\"';
			else content += 'class=\"unclosable\"';
			content += '>' + buttons[i] + '</button> <div class="divider"/>';
		}
	}
	
	// Remove old modal messages to keep the stack clean
	var modals = document.getElementsByClassName('custom');
	if (modals.length > 0) {
		for (var i = 0; i < modals.length; i++) modals.item(i).remove();
	}
	
    // Configure the avgrund modal window layer
	if (message.substring(4, 7) === 'Way') {
		
		// Probably the hackiest thing I've ever coded...
		// Needs to be revisited.
		setTimeout(function() {
			obj = $('#simulate').avgrund({
				height: 200,
				holderClass: 'custom',
        		closeByEscape: false,
        		closeByDocument: false,
				enableStackAnimation: true,
				onBlurContainer: '.container',
        		openOnEvent: false,
    			template: content,
			});
		}, 2000);
	}
    
	else {
		obj = $('#simulate').avgrund({
			height: 200,
			holderClass: 'custom',
        	closeByEscape: false,
        	closeByDocument: false,
			enableStackAnimation: true,
			onBlurContainer: '.container',
        	openOnEvent: false,
    		template: content,
		});
	}
	
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
		
		modals = document.getElementsByClassName('custom');
		
		for (var i = 0; i < modals.length; i++) {
			var text = modals.item(i).innerHTML.toString();
			if (text.indexOf(message) > -1) modals.item(i).remove();
		}
		
		document.body.className = "avgrund-ready";
	}
}
