/**
 * This class creates the main viewport and updates it accordingly.
 */
function viewport() {
	
	// Declare all of the viewport elements
	var graph;
	var sample_table;
	var selection_table;
	var trial_table;
	
	this.init = function(messenger) {
	
		// Instantiate all of the viewport elements
		graph = new chart();
		sample_table = new sampleTable();
		selection_table = new selectionTable();
		trial_table = new trialTable();
		
		// Configure the layout grid
    	$('.gridster ul').gridster({
        	autogrow_cols: true,
        	widget_margins: [20, 20],
        	widget_base_dimensions: [600, 100]
    	}).data('gridster').disable();
		
		// Configure the run simulation button to make the ajax call
    	document.getElementById('simulate').addEventListener('click', function(){
            
    	    var inputs = selection_table.get_inputs(true);
    	    if (inputs) {
            
    	        messenger.send('update', inputs);
    	        new modal('<p>Calculating your distillation curve. Results will appear shortly.</p>');
    	    }
    	});
		
		// Trigger the initial viewport update
		messenger.send('update', {
			comps: ['none', 'none', 'none', 'none'], 
			pcts: [0, 0, 0, 0]
		});
	}
	
	/**
 	 * The primary function for viewport management. Updates the
	 * viewport whenever new information is passed via ajax.
 	 */
	this.update = function(message) {
		
		console.log(message);
		
		// Display the game level
        document.getElementById('level').innerHTML = 'Level ' + message.level;
		
		// Update the viewport elements
		sample_table.update(message);
		selection_table.update(message);
		trial_table.update(message);
		graph.update(message);
	}
}