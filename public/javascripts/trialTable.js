/**
 * This class represents the trial table by wrapping the dataTable
 * plugin.
 */
function trialTable() {
	
	var table;
	
	/**
 	 * Updates the trial table and its data based on the json received
	 * from the controllers and models.
 	 */
	this.update = function(json) {
		
		// Parse the json message
		var info = parse_json(json);
		
		// Create the table based on the samples
		if (table) table.fnDestroy();
		table = $('#trials').dataTable({
            'ordering': true,
            'paging': false,
            'searching':false,
            'columns': [
                {'title': 'Trials'},
                {'title': '% ' + info.sampleNames[0]},
                {'title': '% ' + info.sampleNames[1]},
                {'title': '% ' + info.sampleNames[2]},
                {'title': 'Score'},
            ],
			'data': info.trialData
        });
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
				var k = 0;
				for (var i = 0; i < sampleNames.length; i++) {
					
					if (sampleNames[i].toLowerCase() == trials[j].comps[k]) {
						trialData[j - 1][i + 1] = trials[j].pcts[k] * 100;
						k++;
					}
					else trialData[j - 1][i + 1] = 0;
					
				}
				
				// Add the score onto the end
				trialData[j - 1][trialData[j - 1].length] = trials[j].score;
			}
		
			info.trialData = trialData;
		}	
		
		return info;
	}
}