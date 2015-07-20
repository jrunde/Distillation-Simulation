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
    	document.getElementById('simulate').addEventListener('click', run);
		
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
		
		// Check if the game is ending
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
		
		// Have the user assess their work
		if (message.data.length > 1) assess(message);
	}
	
	/**
 	 * The callback for the run button. It basically generates the ajax message
	 * to send to the Java side.
 	 */
	function run(){
            
    	var inputs = selection_table.get_inputs(true);
    	if (inputs) {
            
    		messenger.send('update', inputs);
   		}
    }
	
	/**
 	 * The user assessment mode of the gameflow. Here the user is given the
	 * chance to state if they think their fuel is a good replacement for the
	 * target curve.
 	 */
	function assess(message) {
		
		var yes = function() {
			
			// Advance if level has been completed
			var score = message.data[message.data.length - 1].score;
			
			if (!advanced && score && score > 90) {
				
				// Change button
				document.getElementById('simulate').innerHTML = 'Next Level';
				document.getElementById('simulate').removeEventListener('click', run);
				document.getElementById('simulate').addEventListener('click', advance);
			}
			
			else advanced = false;
		};
		
		var no = function() {
			
			
		};
		
		new modal('Do you think this mixture would make a good drop-in fuel ' + 
			'for the target mixture?', ['Yes', 'No'], [yes, no]);
	}
	
	/**
 	 * Advances the level by displaying a modal message and sending
	 * a new ajax call to advance.
 	 */
	function advance() {
		
		advanced = true;
		messenger.send('advance', null);
		
		// Change button back
		document.getElementById('simulate').innerHTML = 'Run';
		document.getElementById('simulate').removeEventListener('click', advance);
		document.getElementById('simulate').addEventListener('click', run);
	}
	
	/**
 	 * Ends the game.
 	 */
	function end(mode) {
		
		if (mode == 'complete') {
			new modal('Congratulations! You completed all of the levels.', ['Ok']);
		
			setTimeout(function() {
				messenger.send('quit', null);
			}, 3000);
		}
		
		else if (mode == 'quit') window.location.href = '/';
	}
}