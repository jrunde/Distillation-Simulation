/**
 * This class represents the sample table by wrapping the dataTable
 * plugin.
 */
function sampleTable() {
	
	var table;
	var added = 0;
	var history;
	
	/**
 	 * Access the data of the sample table.
 	 */
	this.get_data = function() {

		return table.fnGetData();
	}
	
	/**
 	 * Updates the sample table and its data based on the json received
	 * from the controllers and models.
 	 */
	this.update = function(json) {
		
		// Parse the original message
		var data = parse_json(json);
		
		// Create the table based on the samples
		if (table) table.fnDestroy();
		table = $('#sample-compounds').dataTable({
            'paging': false,
            'searching': false,
			'scrollCollapse': true,
			'scrollY': '250px',
			'dom': '<"top">rt<"bottom"><"clear">',
            'columns': [
                {'title': 'Name'},
                {'title': 'Boiling Point (K)'},
                {'title': 'Molecular Weight (g)'},
				{'title': 'Add/Remove'}
            ],
        });
		
		// Add all of the data to the table
		table.fnClearTable(true);
		for (var i = 0; i < data.length; i++) {
			
			table.fnAddData(data[i], true);
	
			// Configure the add buttons to add components to the selection table
    		document.getElementById('add' + i).addEventListener('click', add);
		}
	}
	
	/**
 	 * Parses the json message and returns the info structured appropriately.
 	 */
	function parse_json(json) {
		
		var samples = json.samples;
		
		// Generate an array for the sample data
        var sampleData = [];
        for (var i = 0; i < samples.length; i++) {
        
			sampleData[i] = [samples[i].name, samples[i].boilpoint, samples[i].mass,
				'<button type="button" id="add' + i + '">Add</button>'];
		}
		
		return sampleData;
	}
	
	/**
 	 * Adds a component from the sample table to the selection table.
 	 */
	function add(evt) {
		
		// If the element is being added...
		if (evt.target.innerHTML == "Add") {
			
			if (added >= 4) return;
			
			// Get the selection table data
			var forms = viewport.get_selection_table().get_forms();

			// Check if user percentages are at 100
			var sum = 0;
			for (var i = 0; i < forms.length; i++) {
			
				if (forms[i]) sum += forms[i].get_value();
				if (sum >= 100) return;
			}
			
			// Change the button text to remove
			evt.target.innerHTML = "Remove";
			
			// Add it to the selection table
			viewport.get_selection_table().add(evt.target.id.slice(3));
			added++;
		}
		
		// If the element is being removed...
		else {
			
			// Change the button text to add
			evt.target.innerHTML = "Add";
			
			// Remove it from the selection table
			viewport.get_selection_table().remove(evt.target.id.slice(3));
			added--;
		}
	}
	
	/**
 	 * Reset the added counter.
 	 */
	this.reset_samples = function() {
		
		added = 0;
	}
	
	/**
 	 * Converts the table to the wrap-up table
 	 */
	this.wrapup = function(message) {
		
		console.log(message);
		history = message.history;
		
		// Create the column array
		var data = [];
		for (var i = 0; i < history.length; i++) {
			
			// Put level number
			data[i] = ['Level ' + (i + 1)];
			
			// Put number of trials
			data[i][1] = history[i].length - 1;
			
			// Put average and best scores
			var sum = 0;
			var best = 0;
			for (var j = 1; j < history[i].length; j++) {
				sum += history[i][j].score;
				if (history[i][j].score > best) best = history[i][j].score;
			}
			data[i][2] = Math.round(sum / data[i][1]);
			data[i][3] = Math.round(best);
			data[i][4] = '<button type="button" id="show' + i + '">Show Best</button>';
		}
		
		var last = data.length;
		data[last] = ['Overall'];
		
		for (var i = 1; i < 4; i++) {
			
			var sum = 0;
			for (var j = 0; j < data.length - 1; j++)
				sum += data[j][i]
			
			data[last][i] = Math.round(sum / last);
		}
		
		data[last][4] = '<button type="button" id="show' + last + '">Show Best</button>';
		
		// Properly destroy the table
		if (table) {

			table.fnClearTable(true);
			table.fnDestroy(false);
			
			$("#sample-compounds thead tr th").eq(0).after('<th></th>');
		}
	
		// Create the new updated table
		table = $('#sample-compounds').dataTable({
            'paging': false,
            'searching': false,
			'dom': '<"top">rt<"bottom"><"clear">',
            'columns': [
				{'title': 'Level'},
				{'title': 'Number of Trials'},
				{'title': 'Average Score'},
				{'title': 'Best Score'},
				{'title': 'Show Best Graph'}
			]
        });
		
		for (var i = 0; i < data.length; i++) {
			
			table.fnAddData(data[i], true);
	
			// Configure the add buttons to add components to the selection table
    		document.getElementById('show' + i).addEventListener('click', show);
		}
	}
	
	/**
 	 * Shows a graph in the chart at screen right.
 	 */
	function show(evt) {
		
		var row = evt.target.id.slice(4);
		var score = table.fnGetData()[row][3];
		
		var comps = [];
		var pcts = [];
		
		if (row >= history.length) {
			
			var best = 0;
			for (var i = 0; i < history.length; i++) {
			
				if (table.fnGetData()[i][3] > best) {
					best = table.fnGetData()[i][3];
					row = i;
				}
			}
		}
		console.log(row);
		for (var i = 1; i < history[row].length; i++) {
			
			if (Math.round(history[row][i].score) == score) {
				comps = history[row][i].comps;
				pcts = history[row][i].pcts;
			}
		}
			
		console.log(comps);
		console.log(pcts);
		
		messenger.send('update', {
			comps: comps,
			pcts: pcts
		});
	}
}