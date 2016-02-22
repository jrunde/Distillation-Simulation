/**
 * This class represents the selection table by wrapping the dataTable
 * plugin.
 */
function selectionTable() {
	
	var table;
	var data = [];
	var samples = [];
	var forms = [];
	var components = [];
	var percentages = [];
	
	/**
 	 * Removes the table from the viewport.
 	 */
	this.destroy = function() {
		
		if (table) {
			table.fnClearTable(true);
		 	table.fnDestroy(true);
		}
	}
	
	/**
     * Gets the user's inputs. Do not call if update hasn't been called previously.
     *
     */
    this.get_inputs = function() {
        
		// Make sure percentages add up to 100
		var sum = 0;
		for (var i = 0; i < percentages.length; i++)
			if (percentages[i]) sum += percentages[i];
        
		if (sum != 100) {
			new modal('Your percentages do not add up to 100%.', ['Ok'], [], [true]);
            return;
		}
		
        // Package all of the input into a data structure
        var inputs = {
            comps: components,
            pcts: percentages
        }
        
		console.log(inputs);
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
		
		// Clear the selection table
		if (table) {
			table.fnClearTable(true);
			return;
		}
		
		// Create the selection table
		table = $('#selected-compounds').dataTable({
            'ordering': true,
            'paging': false,
            'searching':false,
			'dom': '<"top">rt<"bottom"><"clear">',
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
	this.add = function(index) {
		
		// Format the new data to be added
		var new_data = viewport.get_sample_table().get_data()[index];
		new_data[3] = '<form><input type="number" id="pct' + index + '" value="0" min="0" ' +
			'max="100" step="5" readonly></form>';
			
		// Add new data component to components list
		for (var j = 0; j < samples.length; j++) {
			if (new_data[0] == samples[j].name) {
				components[index] = samples[j].matname;
				break;
			}
		}
	
		// Add new data to percentages list
		percentages[index] = 0;
		
		// Add it to the data array
		data[data.length] = new_data;

		// Put the data into the table
		table.fnClearTable(true);
		for (var i = 0; i < data.length; i++) {
			
			table.fnAddData(data[i], true);
			var beg = data[i][3].lastIndexOf('pct') + 3;
			var end = data[i][3].lastIndexOf('" val');
			var num = data[i][3].substring(beg, end);
			
			// Create the form
			if (percentages[num] !== null) 
				forms[num] = new incrementbox(num, percentages[num]);
			else forms[num] = new incrementbox(index, 0);
		}
	}
	
	/**
 	 * Removes the data from the selection table based on the user's choices
	 * in the sample table.
 	 */
	this.remove = function(index) {
		
		// Store the data to be removed
		var new_data = viewport.get_sample_table().get_data()[index];
	
		// Remove the data from the array, component list, and percentages list
		for (var i = 0; i < data.length; i++) {
			if (data[i][0] == new_data[0]) {
				data.splice(i, 1);
				break;
			}
		}

		components[index] = null;
		percentages[index] = null;
		forms[index] = new incrementbox(index, 0);
		
		// Put the array into the table
		table.fnClearTable(true);
		for (var i = 0; i < data.length; i++) {
			
			table.fnAddData(data[i], true);
			var beg = data[i][3].lastIndexOf('pct') + 3;
			var end = data[i][3].lastIndexOf('" val');
			var num = data[i][3].substring(beg, end);
			
			// Create the form
			if (percentages[num] !== null) 
				forms[num] = new incrementbox(num, percentages[num]);
			else forms[num] = new incrementbox(index, 0);
		}
	}
	
	/**
 	 * Reset the selection arrays.
 	 */
	this.reset_selections = function() {
		
		components = [];
		percentages = [];
		forms = [];
	}
	
	/**
 	 * Update a percentage form.
 	 */
	this.update_form = function(index, value) {
		
		percentages[index] = value;
	}
	
	/**
 	 * Access the forms of the selection table.
 	 */
	this.get_forms = function() {
		
		return forms;
	}
	
	/**
 	 * Access the data of the selection table.
 	 */
	this.get_data = function() {
		
		return data;
	}
}