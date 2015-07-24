/**
 * This class represents the sample table by wrapping the dataTable
 * plugin.
 */
function sampleTable() {
	
	var table;
	var forms = [];
	
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
            'paging': true,
            'searching': false,
			'iDisplayLength': 4,
			'dom': '<"top">rt<"bottom"ip><"clear">',
            'columns': [
                {'title': 'Name'},
                {'title': 'Boiling Point (K)'},
                {'title': 'Molecular Weight (g)'},
				{'title': 'Percentage (%)'}
            ],
        });
		
		// Add all of the data to the table
		table.fnClearTable(true);
		for (var i = 0; i < data.length; i++) {
			
			table.fnAddData(data[i], true);
			forms[i] = new incrementbox(i);
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
				'<form><input type="number" id="pct' + i + '" value="0" min="0" ' +
				'max="100" step="5"></form>'];
        }
		
		return sampleData;
	}
}