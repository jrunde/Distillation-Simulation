/**  
 * This class is the primary engine for the distillation simulation
 * GUI. Everything JavaScript will be routed through this file into
 * main.scala.html.
 *
 */
  
var viewport;
var messenger;

require.config({
	shim: {
		'stepper': {
			deps: ['jquery'],
			exports: 'stepper'
		},
		'bootstrap-switch': {
			deps: ['jquery'],
			exports: 'bootstrap-switch'
		},
	},
    paths: {
	    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
		'form': '/assets/javascripts/plugins/form',
        'datatables': '/assets/javascripts/plugins/dataTables',
        'gridster': '/assets/javascripts/plugins/gridster',
        'gridster-collision': '/assets/javascripts/plugins/collision',
        'gridster-draggable': '/assets/javascripts/plugins/draggable',
        'gridster-coords': '/assets/javascripts/plugins/coords',
        'gridster-utils': '/assets/javascripts/plugins/utils',
		'avgrund': '/assets/javascripts/plugins/avgrund',
		'chartnew': '/assets/javascripts/plugins/chartnew.js',
		'stepper': '/assets/javascripts/plugins/stepper',
		'bootstrap-switch': '/assets/javascripts/plugins/bootstrap-switch',
		'bootstrap': '/assets/javascripts/plugins/bootstrap',
		'highlight': '/assets/javascripts/plugins/highlight',
    },
});

require([
		'/assets/javascripts/viewport.js',
		'/assets/javascripts/messenger.js',
		'/assets/javascripts/modal.js',
		'/assets/javascripts/chart.js',
		'/assets/javascripts/trialTable.js',
		'/assets/javascripts/sampleTable.js',
		'/assets/javascripts/selectionTable.js',
		'/assets/javascripts/incrementbox.js',
        '/assets/javascripts/plugins/json.js',
		'/assets/javascripts/plugins/chartnew.js',
		'form',
        'datatables',
        'gridster',
        'gridster-collision',
        'gridster-draggable',
        'gridster-coords',
        'gridster-utils',
		'avgrund',
		'stepper',
		'bootstrap-switch',
		'bootstrap',
		'highlight',
    ], function() {
	
	messenger = new messenger();
    var box = $('#levels').stepper();
	var boot = $("[name='matlab']").bootstrapSwitch({
		state: 'true',
		size: 'normal',
		onText: 'On',
		offText: 'Off'
	});
	
	// Configure the run simulation button to make the ajax call
    document.getElementById('play').addEventListener('click', function(){
        
		// Put up a loading message
    	var obj = $('#play').avgrund({
			height: 200,
			holderClass: 'Landing',
        	closeByEscape: false,
        	closeByDocument: false,
			enableStackAnimation: true,
			onBlurContainer: '.container',
        	openOnEvent: false,
    		template: '<h3>Just one moment.</h3><br/><p>Please wait while your game loads.</p>',
		});
		
		// Test var
		var levels = parseInt(box.val());
		var matlab = !boot.bootstrapSwitch('state');
		var success = function(msg) {
				
			// Redirect to the application
            window.location.assign('./play?' + msg.id);
		}
            
		// Trigger the initial viewport update
		messenger.send('set_levels', {
			levels: levels,
			matlab: matlab,
		}, success);
    });
	
    // Configure the layout grid
    $('.gridster ul').gridster({
        autogrow_cols: true,
        widget_margins: [20, 20],
        widget_base_dimensions: [300, 100]
    }).data('gridster').disable();
});
