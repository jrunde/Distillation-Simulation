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
	var me = this;
	
	/**
 	 * The primary function for viewport management. Updates the
	 * viewport whenever new information is passed via ajax.
 	 */
	this.update = function(message) {
		
		console.log(message);
		
		if (loading) loading.destroy();
		
		// Check if the game is ending
		if (message.end_mode) {
			
			end(message);
			return;
		}
			
		if (recap) {
				
			graph.update(message);
			return;
		}
		
		// Display the game level
        document.getElementById('level').innerHTML = 'Level ' + message.level;
		
		// Prompt user with beginning question
		if (message.data.length <= 1) pose_question(message);
		
		// Enable run button
		document.getElementById('simulate').disabled = false;
		
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
	
		// Disable run button to begin
		document.getElementById('simulate').disabled = true;
		
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
        	widget_base_dimensions: [600, 90]
    	}).data('gridster').disable();
		
		// TODO: real fix is making matlab boot in different thread
		// Send a dummy update message to initialize the viewport
		var msg = {
			level: 1,
			data: [{
				num: 0,
				gas: [0],
				x_axis: [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,99],
			}],
			samples: [],
		}
		
		this.update(msg);
		
		// Put up a loading message
		if (location.search.substring(1).length == 0) {
			loading = new modal('<h2>Just one moment.</h2><br><p>Please wait while ' + 
				'your game loads.</p>', [], [], []);
		}
		
		// Trigger the initial viewport update
		messenger.send('update', {
			comps: ['none', 'none', 'none', 'none'],
			pcts: [0, 0, 0, 0]
		}, this.update);
		
		// Configure the run simulation button to make the ajax call
    	document.getElementById('simulate').addEventListener('click', run);
	}
	
	/**
 	 * Accessor for graph.
 	 */
	this.get_graph = function() {
		
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
        
		document.getElementById('simulate').disabled = true;
    	var inputs = selection_table.get_inputs();
    	if (inputs) messenger.send('update', inputs, me.update);
		else document.getElementById('simulate').disabled = false;
    }
	
	/**
 	 * Assesses whether the player has passed the level. If they have, they are
	 * prompted with a window to continue onto the next level.
 	 */
	function assess(message) {
			
		// Update the viewport
		var score = message.data[message.data.length - 1].score;
		trial_table.update(message);
		selection_table.reset_selections();
		sample_table.reset_samples();
			
		// Advance if level has been completed
		if (score > 80) {
				
			// Prompt user that they've completed the level
			new modal('<h2>Congratulations!</h2><br/><p>You passed the level. Are you ' +
				'ready to continue?</p>', ['Continue'], [advance], [false]);
		}
		
		else if (message.data.length > 5) {
			
			// Prompt user that they've completed the level
			new modal('<h2>Keep trying?</h2><br/><p>Would you like to attempt this level ' +
				'again or skip it?</p>', ['Try Again', 'Skip It'], [null, advance], [true, false]);
		}
	}
	
	/**
 	 * Advances the level by displaying a modal message and sending
	 * a new ajax call to advance.
 	 */
	function advance() {
		
		messenger.send('advance', null, me.update);
		trial_table.clear();
	}
	
	/**
 	 * Ends the game.
 	 */
	function end(message) {
		
		if (message.end_mode == 'complete') {
			
			new modal('<h2>Congratulations!</h2><br><p>You completed all of the ' +
				'levels.</p>', ['Continue'], [], [true]);
			recap = true;
			
			// Destroy all the current tables
			sample_table.wrapup(message);
			selection_table.destroy();
			trial_table.destroy();
			
			// Change button to 'Exit'
			document.getElementById('simulate').innerHTML = 'Exit';
			document.getElementById('simulate').removeEventListener('click', run);
			document.getElementById('simulate').addEventListener('click', function() {
				messenger.send('quit', null, me.update);
			});
			
			// Change level text
			document.getElementById('level').innerHTML = 'Recap';
		}
		
		else if (message.end_mode == 'quit') window.location.href = '/';
	}
	
	/**
 	 * Prompts the user with a pre-level question.
 	 */
	function pose_question(message) {
		
		// Block against poor message timing
		if (message.data.length > 1) return;
		if (message.data[0].gas.length < 21) return;
		
		var question;
		if (message.level == 1) {
			question = '<h2>Answer the question below on paper.</h2><br><p>Based ' +
				'on the distillation curve what is the likely boiling point of ' +
				'this fuel? Explain your reasoning.</p>';
		}
		
		else if (message.level == 4) {
			question = '<h2>Way to go on passing levels 1-3!</h2><br>Now see if you ' +
				'can design a biofuel mixture to match the curve for actual gasoline ' +
				'using up to 4 components!</p>';
			
		}
		
		else {
			question = '<h2>Answer the question below on paper.</h2><br><p>Based ' +
				'on this distillation curve, how many components are likely in ' +
				'the fuel mixture? Explain your reasoning.</p>';
		}
		
		new modal(question, ['Done'], [], [true]);
		
	}
}