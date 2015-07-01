/**
 * This class represents the sample table by wrapping the dataTable
 * plugin.
 */
function sampleTable() {
	
	var table;
	
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
            'columns': [
                {'title': 'Name'},
                {'title': 'Boiling Point (K)'},
                {'title': 'Molecular Molar Mass (g)'}
            ], 
			'data': data
        });
	}
	
	/**
 	 * Parses the json message and returns the info structured appropriately.
 	 */
	function parse_json(json) {
		
		var samples = json.samples;
		
		// Generate an array for the sample data
        var sampleData = [];
        for (var i = 0; i < samples.length; i++) {
        
            sampleData[i] = [samples[i].name, samples[i].boilpoint, samples[i].mass];
        }
		
		return sampleData;
	}
}