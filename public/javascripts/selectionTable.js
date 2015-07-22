/**
 * This class represents the selection table by wrapping the dataTable
 * plugin.
 */
function selectionTable() {
	
	var table;
	var data = [];
	
	/**
     * Gets the user's inputs. Do not call this if update hasn't been called previously.
     *
     */
    this.get_inputs = function(validate) {
        
		// Package the components and percentages into an array
		var components = [];
		var percentages = [];
		
		for (var i = 0; i < data.length; i++) {
			components[i] = data[i][0];
			percentages[i] = data[i][3]; // TODO: Make sure it gets matname here
		}
		
        // Block against null components with percentages and vice versa
        for (var i = 0; i < components.length; i++) {
            if (components[i] == "none" && percentages[i] != 0) percentages[i] = 0.0;
            else if (percentages[i] == 0 && components[i] != "none") components[i] = "none";
        }
        
        // If validation is requested...
        if (validate) {
        	
			// Add up the percentages for checking purposes
        	var sum = 0;
			for (var i = 0; i < percentages.length; i++) sum += percentages[i];
            
			// Defend against bad percentage data
            if (sum < 0) {
                new modal('Not all percentage inputs are correctly formatted.', ['Ok']);
                return;
            } else if (sum != 100) {
                new modal('Your percentages do not add up to 100.', ['Ok']);
                return;
            }
        }
        
        // Package all of the input into a data structure
        var inputs = {
            comps: components,
            pcts: percentages
        }
        
		// Clear data
		data = [];
        console.log(inputs);
        
        return inputs;
    }
	
	/**
 	 * Updates the selection table and its data based on the json received
	 * from the controllers and models.
 	 */
	this.update = function(index, val) {

		// Parse the json message for the sample names
		if (index != null) {
			
			// Format the new data to be added
			var new_data = viewport.get_sample_table().get_data()[index];
			new_data[3] = val;
	
			// Add it or amend the table to reflect the new data
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
			
			return;
		}
		
		// Create the selection table
		table = $('#selected-compounds').dataTable({
            'ordering': false,
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
 	 * Access the data of the selection table.
 	 */
	this.get_data = function() {
		
		return table.fnGetData();
	}
}