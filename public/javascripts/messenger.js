/**
 * This class handles all of the ajax messaging to and from the
 * Java application.
 */
function messenger(viewport) {
	
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
 
        jsRoutes.controllers.Application.ajaxCall().ajax(ajaxCallBack);
    };
 
    /**
     * Handles an ajax error.
     *
     */
    function onError(error) {
        
		console.log("Error");
        console.log(error);
    }
}