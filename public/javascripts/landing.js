/**  
 * This class is the primary engine for the distillation simulation
 * GUI. Everything JavaScript will be routed through this file into
 * main.scala.html.
 *
 */
require.config({
    paths: {
        'datatables': '/assets/javascripts/dataTables',
        'gridster': '/assets/javascripts/gridster',
        'gridster-collision': '/assets/javascripts/collision',
        'gridster-draggable': '/assets/javascripts/draggable',
        'gridster-coords': '/assets/javascripts/coords',
        'gridster-utils': '/assets/javascripts/utils',
        'avgrund': '/assets/javascripts/avgrund'
    }
});

require(['/assets/javascripts/chartnew.js',
        '/assets/javascripts/json.js',
        'datatables',
        'gridster',
        'gridster-collision',
        'gridster-draggable',
        'gridster-coords',
        'gridster-utils',
        'avgrund'
    ], function(){
    
    /**
     * Makes an ajax call.
     *
     */
    var ajaxCall = function(components) {
        
        var ajaxCallBack = {
            method: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(components),
            success: update,
            error: onError
        }
 
        jsRoutes.controllers.Application.ajaxCall().ajax(ajaxCallBack);
    };
 
    /**
     * Handles an ajax error.
     *
     */
    var onError = function(error) {
        console.log("Error");
        console.log(error);
    }
    
    /**
     * Handles an ajax error.
     *
     */
    var avgrund = function(message) {
        
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
    
    /**
     * Document on ready function. This is essentially the main function
     * for the java script code.
     *
     */
    $(function() {
      
        launch();
    });
    
    /**
     * Launches the viewport.
     *
     */
    function launch() {
        
        // Configure the run simulation button to make the ajax call
        document.getElementById('play').addEventListener('click', function(){
            
            //ajaxCall();
                
            // Redirect to the application
            window.location.assign('./play');
        });
        
        // Configure the layout grid
        $('.gridster ul').gridster({
            autogrow_cols: true,
            widget_margins: [20, 20],
            widget_base_dimensions: [600, 100]
        }).data('gridster').disable();
    }
});
