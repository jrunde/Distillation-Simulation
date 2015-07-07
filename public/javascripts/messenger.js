/**
 * This class handles all of the ajax messaging to and from the
 * Java application.
 */
function messenger(viewport) {
	
	var hashcode = makeid();
	
	/**
     * Makes an ajax call.
     *
     */
    this.send = function(task, components) {
        
        var ajaxCallBack = {
            method: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                task: task,
                inputs: components,
            }),
            success: viewport.update,
            error: onError
        }
 
        jsRoutes.controllers.Application.ajaxCall(hashcode).ajax(ajaxCallBack);
    };
 
    /**
     * Handles an ajax error.
     *
     */
    function onError(error) {
        
        console.log(error);
    }
	
	/**
     * Generates a unique hashcode for each messenger to stamp the game
	 * with a unique ID.
     *
     */
	function makeid() {
		
    	var text = "";
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    	for(var i = 0; i < 10; i++)
        	text += possible.charAt(Math.floor(Math.random() * possible.length));

    	return text;
	}
}