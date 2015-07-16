/**  
 * This class is the primary entrypoint for the distillation simulation
 * GUI. Everything JavaScript will be routed through this file into
 * main.scala.html. It loads all of the required scripts and instantiates
 * the main viewport and ajax messaging layer.
 *
 */
require.config({
	shim: {
		'selectric': {
			deps: ['jquery'],
			exports: 'selectric'
		},
		'stepper': {
			deps: ['jquery'],
			exports: 'stepper'
		},
	},
    paths: {
	    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
		'form': '/assets/javascripts/plugins/form',
        'selectric': '/assets/javascripts/plugins/selectric',
        'datatables': '/assets/javascripts/plugins/dataTables',
        'gridster': '/assets/javascripts/plugins/gridster',
        'gridster-collision': '/assets/javascripts/plugins/collision',
        'gridster-draggable': '/assets/javascripts/plugins/draggable',
        'gridster-coords': '/assets/javascripts/plugins/coords',
        'gridster-utils': '/assets/javascripts/plugins/utils',
        'avgrund': '/assets/javascripts/plugins/avgrund',
		'chartnew': '/assets/javascripts/plugins/chartnew.js',
		'stepper': '/assets/javascripts/plugins/stepper',
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
		'/assets/javascripts/dropdown.js',
		'/assets/javascripts/textform.js',
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
		'selectric',
		'stepper',
    ], function() {
	
	// Instantiate the viewport and the ajax messenger
	this.viewport = new viewport();
	this.messenger = new messenger(this.viewport);
	
	// Boot up the viewport
	this.viewport.init(this.messenger);
});
