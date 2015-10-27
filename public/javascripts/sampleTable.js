/**
 * This class represents the sample table by wrapping the dataTable
 * plugin.
 */
function sampleTable() {
	
	var table;
	var added = 0;
	
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
	
			// Configure the run simulation button to make the ajax call
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
		
		
		// Create the column array
		var columns = [
			{'title': 'Level'},
			{'title': 'Number of Trials'},
			{'title': 'Average Score'},
		];
		
		// Properly destroy the table
		if (table) {

			table.fnClearTable(true);
			table.fnDestroy(false);

			$('#trials thead').find('tr th:nth-child(3)').each(function(){$(this).remove()});
			$('#trials tbody').find('tr td:nth-child(3)').each(function(){$(this).remove()});
		}
		
		console.log(message);
		
		// Create the new updated table
		table = $('#sample-compounds').dataTable({
            'paging': false,
            'searching': false,
			//'scrollCollapse': true,
			//'scrollY': '250px',
			'dom': '<"top">rt<"bottom"><"clear">',
            'columns': columns,
			'data': [[0, 0, 0]]
        });
	}
}