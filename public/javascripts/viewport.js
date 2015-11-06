/**
 * This class creates the main viewport and updates it accordingly.
 */
function viewport() {
	
	// Declare all of the viewport elements
	var graph;
	var sample_table;
	var selection_table;
	var trial_table;
	var loading;
	var recap = false;
	
	/**
 	 * The primary function for viewport management. Updates the
	 * viewport whenever new information is passed via ajax.
 	 */
	this.update = function(message) {
		
		console.log(message);
		
		if (loading) loading.destroy();
		
		// Check if the game is ending
		if (message.end_mode) {
			
			if (!recap) {
				end(message);
				return;
			}
			
			else {
				graph.update(message);
				return;
			}
		}
		
		// Display the game level
        document.getElementById('level').innerHTML = 'Level ' + message.level;
		
		// Prompt user with beginning question
		if (message.data.length <= 1) new modal('Pre-Level question would go here.', ['Ok']);
		
		// Update the viewport elements
		sample_table.update(message);
		selection_table.update(message);
		graph.update(message);
		
		// Have the user assess their work
		if (message.data.length > 1) assess(message);
		else trial_table.update(message);
	}
	
	/**
 	 * Initializes the viewport. This prepares a dummy interface,
	 * prompts the user with a "Game Loading" message, and sends the
	 * initial request for the model data.
 	 */
	this.init = function() {
	
		// Instantiate all of the viewport elements
		graph = new chart();
		sample_table = new sampleTable();
		selection_table = new selectionTable();
		trial_table = new trialTable();
		advanced = false;
		
		// Configure the layout grid
    	$('.gridster ul').gridster({
        	autogrow_cols: true,
			max_cols: 2,
        	widget_margins: [20, 20],
        	widget_base_dimensions: [600, 80]
    	}).data('gridster').disable();
		
		// TODO: real fix is making matlab boot in different thread
		// Send a dummy update message to initialize the viewport
		var msg = {
			level: 1,
			data: [{
				num: 0,
				gas: [0],
				x_axis: [0],
			}],
			samples: [],
		}
		
		this.update(msg);
		
		// Put up a loading message
		loading = new modal('Please wait while your game loads.', [], []);
		
		// Trigger the initial viewport update
		messenger.send('update', {
			comps: ['none', 'none', 'none', 'none'],
			pcts: [0, 0, 0, 0]
		});
		
		// Configure the run simulation button to make the ajax call
    	document.getElementById('simulate').addEventListener('click', run);
	}
	
	/**
 	 * Accessor for graph.
 	 */
	this.graph = function() {
		
		return graph;
	}
	
	/**
 	 * Accessor for sample table.
 	 */
	this.get_sample_table = function() {
		
		return sample_table;
	}
	
	/**
 	 * Accessor for selection table.
 	 */
	this.get_selection_table = function() {
		
		return selection_table;
	}
	
	/**
 	 * Accessor for trial table.
 	 */
	this.get_trial_table = function() {
		
		return trial_table;
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
			
			// Show score in trial table
			var score = message.data[message.data.length - 1].score;
			trial_table.update(message);
			
			// Advance if level has been completed
			if (score > 80) {
				
				// Change button
				document.getElementById('simulate').innerHTML = 'Next Level';
				document.getElementById('simulate').removeEventListener('click', run);
				document.getElementById('simulate').addEventListener('click', advance);
			}
			
			// Reset selections and samples
			selection_table.reset_selections();
			sample_table.reset_samples();
		};
		
		var no = function() {
			
			trial_table.update(message);
			
			// Reset selections and samples
			selection_table.reset_selections();
			sample_table.reset_samples();
		};
		
		new modal('Do you think this mixture would make a good drop-in fuel ' + 
			'for the target mixture?', ['Yes', 'No'], [yes, no]);
	}
	
	/**
 	 * Advances the level by displaying a modal message and sending
	 * a new ajax call to advance.
 	 */
	function advance() {
		
		messenger.send('advance', null);
		
		// Change button back
		document.getElementById('simulate').innerHTML = 'Run';
		document.getElementById('simulate').removeEventListener('click', advance);
		document.getElementById('simulate').addEventListener('click', run);
	}
	
	/**
 	 * Ends the game.
 	 */
	function end(message) {
		
		if (message.end_mode == 'complete') {
			new modal('Congratulations! You completed all of the levels.', ['Ok']);
			recap = true;
			
			// Destroy all the current tables
			sample_table.wrapup(message);
			selection_table.destroy();
			trial_table.destroy();
			
			// Change button to 'Ok'
			document.getElementById('simulate').innerHTML = 'Ok';
			document.getElementById('simulate').removeEventListener('click', run);
			document.getElementById('simulate').addEventListener('click', function() {
				messenger.send('quit', null);
			});
			
			// Change level text
			document.getElementById('level').innerHTML = 'Recap';
		}
		
		else if (message.end_mode == 'quit') window.location.href = '/';
	}
}