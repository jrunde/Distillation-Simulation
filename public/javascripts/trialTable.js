/**
 * This class represents the trial table by wrapping the dataTable
 * plugin.
 */
function trialTable() {
	
	var table;
	var col_size;
	var info = {
		matNames: [],
		sampleNames: [],
		trialData: [],
		lowest: 0,
		ilowest: -1
	};
	
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
 	 * Updates the trial table and its data based on the json received
	 * from the controllers and models.
 	 */
	this.update = function(json) {
		
		// Parse the json message
		parse_json(json);
		
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
			
			for (var i = 0; i <  col_size - columns.length; i++) {
				$('#trials thead').find('tr th:nth-child(' + (columns.length - 1) + ')').each(function(){$(this).remove()});
				$('#trials tbody').find('tr td:nth-child(' + (columns.length - 1) + ')').each(function(){$(this).remove()});
			}
		}
		
		// Create the new updated table
		table = $('#trials').dataTable({
            'ordering': true,
            'paging': false,
            'searching':false,
			'scrollX': true,
			'dom': '<"top">rt<"bottom"><"clear">',
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
		
		var trialNum = json.data.length - 1;
        var trials = json.data;
        var samples = json.samples;
		
		// Collate the sample names
		if (trialNum == 0) {
			info = {
				matNames: [],
				sampleNames: [],
				trialData: [],
				lowest: 0,
				ilowest: -1
			};
		}
		else if (trialNum == 1) {
			for (var i = 0; i < trials[trialNum].comps.length; i++) { 
				
				info.matNames[i] = trials[trialNum].comps[i];
				for (var j = 0; j < samples.length; j++) {
					
					if (info.matNames[i] == samples[j].matname) {
						info.sampleNames[i] = samples[j].name;
						break;
					}
				}
			}
		}
		else {
			for (var i = 0; i < trials[trialNum].comps.length; i++) {
				
				var k = info.matNames.indexOf(trials[trialNum].comps[i]);
				if (k < 0) {
					
					for (var j = 0; j < samples.length; j++) {
						
						if (trials[trialNum].comps[i] == samples[j].matname) {
							
							info.matNames[info.matNames.length] = samples[j].matname;
							info.sampleNames[info.sampleNames.length] = samples[j].name;
							
							for (var l = 0; l < info.trialData.length; l++)
								info.trialData[l].splice(info.trialData[l].length - 1, 0, 0);
								
							break;
						}
					}
				}
			}
		}
		
		// Fill in the trial data
		if (trialNum > 0) {
			
			// If the five slots have not been filled
			if (trialNum <= 5) {
				
				// Add the trial number first
				info.trialData[trialNum - 1] = ['Trial ' + trialNum];
				
				// Add the component percentages
				for (var i = 0; i < info.matNames.length; i++) {
					
					var k = trials[trialNum].comps.indexOf(info.matNames[i]);
					if (k >= 0)
						info.trialData[trialNum - 1][i + 1] = Math.round(trials[trialNum].pcts[k] * 100);
					else info.trialData[trialNum - 1][i + 1] = 0;
				}
				
				// Add the score onto the end
				info.trialData[trialNum - 1][info.trialData[trialNum - 1].length] = 
					Math.round(trials[trialNum].score);
				
				// Update the lowest score pointers
				if (trialNum == 1 || trials[trialNum].score < info.lowest) {
					info.lowest = trials[trialNum].score;
					info.ilowest = trialNum - 1;
				}
			}
		
			// If the five slots are filled
			else if (trials[trialNum].score > info.lowest) {
					
				// Add the trial number first
				info.trialData[info.ilowest] = ['Trial ' + trialNum];
				
				// Add the component percentages
				for (var i = 0; i < info.matNames.length; i++) {
					
					var k = trials[trialNum].comps.indexOf(info.matNames[i]);
					if (k >= 0)
						info.trialData[info.ilowest][i + 1] = Math.round(trials[trialNum].pcts[k] * 100);
					else info.trialData[info.ilowest][i + 1] = 0;
				}
				
				// Add the score onto the end
				info.trialData[info.ilowest][info.trialData[info.ilowest].length] = 
					Math.round(trials[trialNum].score);
				
				// Update the lowest score pointers
				for (var i = 0; i < info.trialData.length; i++) {
					
					if (i == 0 || info.trialData[i][info.trialData[i].length - 1] < info.lowest) {
						info.lowest = info.trialData[i][info.trialData[i].length - 1];
						info.ilowest = i;
					}
				}
			}
		}
		
		return info;
	}
}