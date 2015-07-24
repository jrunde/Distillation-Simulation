/**
 * This class represents the selection table by wrapping the dataTable
 * plugin.
 */
function selectionTable() {
	
	var table;
	var data = [];
	var samples = [];
	
	/**
     * Gets the user's inputs. Do not call if update hasn't been called previously.
     *
     */
    this.get_inputs = function() {
        
		// Package components and percentages into an array
		var sum = 0;
		var components = [];
		var percentages = [];
		for (var i = 0; i < data.length; i++) {
			
			// Check for bad percentage data
			percentages[i] = parseInt(data[i][3]);
			if (isNaN(percentages[i])) {
				
				new modal('Not all percentage inputs are correctly formatted.', ['Ok']);
            	return;
			}
			sum += percentages[i];
			
			// Use matlab names for components
			for (var j = 0; j < samples.length; j++) {
				
				if (data[i][0] == samples[j].name)
					components[i] = samples[j].matname;
			}
		}
        
		// Make sure percentages add up to 100
		if (sum != 100) {
				
			new modal('Your percentages do not add up to 100%.', ['Ok']);
            return;
		}
		
        // Package all of the input into a data structure
        var inputs = {
            comps: components,
            pcts: percentages
        }
        
        return inputs;
    }
	
	/**
 	 * Updates the selection table and its data based on the json received
	 * from the controllers and models.
 	 */
	this.update = function(json) {
		
		// Update the matlab names and clear data
		samples = json.samples;
		data = [];
		
		// Create the selection table
		if (table) return;
		table = $('#selected-compounds').dataTable({
            'ordering': true,
            'paging': false,
            'searching':false,
			'columns': [
                {'title': 'Name'},
                {'title': 'Boiling Point (K)'},
                {'title': 'Molecular Weight (g)'},
				{'title': 'Percentage (%)'}
			]
        });
	}
	
	/**
 	 * Adds the data to the selection table based on the user's choices
	 * in the sample table.
 	 */
	this.add = function(index, val) {
			
		// Format the new data to be added
		var new_data = viewport.get_sample_table().get_data()[index];
		new_data[3] = val;
	
		// Add it or amend the data array to reflect the new data
		var amended = false;
		for (var i = 0; i < data.length; i++) {
			if (data[i][0] == new_data[0]) {
				if (val == 0) data.splice(i, 1);
				else data[i] = new_data;
				amended = true;
			}
		}
		if (!amended) data[data.length] = new_data;

		// Put the data into the table
		table.fnClearTable(true);
		for (var i = 0; i < data.length; i++) table.fnAddData(data[i], true);
	}
	
	/**
 	 * Access the data of the selection table.
 	 */
	this.get_data = function() {
		
		return data;
	}
}