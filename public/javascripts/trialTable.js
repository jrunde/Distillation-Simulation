/**
 * This class represents the trial table by wrapping the dataTable
 * plugin.
 */
function trialTable() {
	
	var table;
	var col_size;
	
	/**
 	 * Updates the trial table and its data based on the json received
	 * from the controllers and models.
 	 */
	this.update = function(json) {
		
		// Parse the json message
		var info = parse_json(json);
		
		// Create the column array
		var columns = [{'title': 'Trials'}];
		for (var i = 0; i < info.sampleNames.length; i++)
			columns[i + 1] = {'title': '% ' + info.sampleNames[i]};
		columns[columns.length] = {'title': 'Score'};
		
		// Properly destroy the table
		if (table) {
			
			table.fnClearTable(true);
			table.fnDestroy(false);
			
			for (var i = 0; i < columns.length - col_size; i++) {
				$("#trials thead tr th").eq(i).after('<th></th>');
			}
		}
		
		// Create the new updated table
		table = $('#trials').dataTable({
            'ordering': true,
            'paging': false,
            'searching':false,
            'columns': columns,
			'data': info.trialData
        });
		
		// Update column size
		col_size = columns.length;
	}
	
	/**
 	 * Parses the json message and returns a structure containing the
	 * sample names and trial data for updating the trial table.
 	 */
	function parse_json(json) {
		
		var info = {};
		var trialNum = json.data.length - 1;
        var trials = json.data;
        var samples = json.samples;
		
		// Collate the sample names
        var sampleNames = [];
        for (var i = 0; i < samples.length; i++) sampleNames[i] = samples[i].name;
		info.sampleNames = sampleNames
		
		// Collate the trial data
        if (trialNum > 0) {

            var trialData = [];
			for (var j = 1; j < trials.length; j++) {
				
				// Add the trial number first
				trialData[j - 1] = ['Trial ' + j];
            	
				// Add the component percentages
				for (var i = 0; i < sampleNames.length; i++) {
					
					var k = trials[j].comps.indexOf(sampleNames[i].toLowerCase());
					if (k >= 0)
						trialData[j - 1][i + 1] = Math.round(trials[j].pcts[k] * 100);
					else trialData[j - 1][i + 1] = 0;
				}
				
				// Add the score onto the end
				trialData[j - 1][trialData[j - 1].length] = Math.round(trials[j].score);
			}
		
			info.trialData = trialData;
		}	
		
		console.log(info);
		return info;
	}
}