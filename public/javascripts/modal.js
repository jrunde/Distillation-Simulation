/**
 * This class creates a modal messaging layer for the client display.
 */
function modal(message) {
	    
    // Configure the avgrund modal window layer
    $('#simulate').avgrund({
		height: 200,
		holderClass: 'custom',
		showClose: true,
        showCloseText: 'Close',
        closeByEscape: true,
        closeByDocument: true,
		enableStackAnimation: true,
		onBlurContainer: '.container',
        openOnEvent: false,
    	template: message
	});
}
