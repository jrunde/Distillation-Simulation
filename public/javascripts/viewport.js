/**
 * This class creates the main viewport and updates it accordingly.
 */
function viewport() {
	
	// Declare all of the viewport elements
	var graph;
	var sample_table;
	var selection_table;
	var trial_table;
	var advanced;
	
	this.init = function(messenger) {
	
		// Instantiate all of the viewport elements
		graph = new chart();
		sample_table = new sampleTable();
		selection_table = new selectionTable();
		trial_table = new trialTable();
		advanced = false;
		
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
		if (message.end_mode) {
			end(message.end_mode);
			return;
		}
		
		// Display the game level
        document.getElementById('level').innerHTML = 'Level ' + message.level;
		
		// Update the viewport elements
		sample_table.update(message);
		selection_table.update(message);
		trial_table.update(message);
		graph.update(message);
		
		// Check if the level has been completed
		var score = message.data[message.data.length - 1].score;
		if (!advanced && score && score > 90) advance();
		else advanced = false;
	}
	
	/**
 	 * Advances the level by displaying a modal message and sending
	 * a new ajax call to advance.
 	 */
	function advance() {
		
		advanced = true;
		new modal('<p>You matched the curve! Moving on to the next level.</p>');
		
		setTimeout(function() {
			messenger.send('advance', null);
		}, 3000);
	}
	
	/**
 	 * Ends the game.
 	 */
	function end(mode) {
		
		if (mode == 'complete') {
			new modal('<p>Congratulations! You completed all of the levels.</p>');
		
			setTimeout(function() {
				messenger.send('quit', null);
			}, 3000);
		}
		
		else if (mode == 'quit') window.location.href = '/';
	}
}