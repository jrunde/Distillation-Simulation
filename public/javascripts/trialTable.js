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
	};
	var updateArray;
	
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
 	 * Resets the table data.
 	 */
	this.clear = function() {
		
		info.matNames = [];
		info.sampleNames = [];
		info.trialData = [];
	}
	
	/**
 	 * Updates the trial table and its data based on the json received
	 * from the controllers and models.
 	 */
	this.update = function(json) {
		
		// Parse the json message
		updateArray = json;
		parse_json(json);
		
		// Create the column array
		var columns = [{'title': 'Trials'}];
		for (var i = 0; i < info.sampleNames.length; i++)
			columns[i + 1] = {'title': '% ' + info.sampleNames[i]};
		columns[columns.length] = {'title': 'Score'};
		columns[columns.length] = {'title': 'View Trial'};
		
		// Properly destroy the table
		if (table) {

			table.fnClearTable(true);
			table.fnDestroy(false);
			
			for (var i = 0; i < columns.length - col_size; i++) {
				$("#trials thead tr th").eq(i).after('<th></th>');
			}
			
			for (var i = 0; i <  col_size - columns.length; i++) {
				$('#trials thead').find('tr th:nth-child(' + (columns.length - 1) + 
					')').each(function(){$(this).remove()});
				$('#trials tbody').find('tr td:nth-child(' + (columns.length - 1) + 
					')').each(function(){$(this).remove()});
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
		
		// Configure the add buttons to add components to the selection table
		for (var i = 1; i < info.trialData.length + 1; i++)
			document.getElementById('view' + i).addEventListener('click', view);

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
		
		for (var j = 1; j <= trialNum; j++) {
			
			// Collate the sample names
			if (j == 0) {
				info = {
					matNames: [],
					sampleNames: [],
					trialData: [],
				};
			}
			else if (j == 1) {
				for (var i = 0; i < trials[j].comps.length; i++) { 
				
					info.matNames[i] = trials[j].comps[i];
					for (var l = 0; l < samples.length; l++) {
					
						if (info.matNames[i] == samples[l].matname) {
							info.sampleNames[i] = samples[l].name;
							break;
						}
					}
				}
			}
			else {
				for (var i = 0; i < trials[j].comps.length; i++) {
				
					var k = info.matNames.indexOf(trials[j].comps[i]);
					if (k < 0) {
					
						for (var l = 0; l < samples.length; l++) {
						
							if (trials[j].comps[i] == samples[l].matname) {
							
								info.matNames[info.matNames.length] = samples[l].matname;
								info.sampleNames[info.sampleNames.length] = samples[l].name;
							
								for (var m = 0; m < info.trialData.length; m++)
									info.trialData[m].splice(info.trialData[m].length - 1, 0, 0);
									
								break;
							}
						}
					}
				}
			}
		
			// Fill in the trial data
			if (trialNum > 0) {
				
				// Add the trial number first
				info.trialData[j - 1] = ['Trial ' + j];
				
				// Add the component percentages
				for (var i = 0; i < info.matNames.length; i++) {
					
					var k = trials[j].comps.indexOf(info.matNames[i]);
					if (k >= 0)
						info.trialData[j - 1][i + 1] = Math.round(trials[j].pcts[k] * 100);
					else info.trialData[j - 1][i + 1] = 0;
				}
				
				// Add the score onto the end
				info.trialData[j - 1][info.trialData[j - 1].length] = 
					Math.round(trials[j].score);
				info.trialData[j - 1][info.trialData[j - 1].length] = 
					'<button type="button" id="view' + j + '">View</button>';
			}
		}
			
		return info;
	}
	
	/**
 	 * Shows a curve for a previous trial.
 	 */
	function view(evt) {
		
		var target = parseInt(evt.target.id.slice(4));
		var viewArray = {
			data: updateArray.data.slice(0, target + 1)
		};
		
		viewport.get_graph().update(viewArray);
	}
}