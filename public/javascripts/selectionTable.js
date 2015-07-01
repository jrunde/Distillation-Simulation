/**
 * This class represents the selection table by wrapping the dataTable
 * plugin.
 */
function selectionTable() {
	
	var table;
	var menus = [];
	var forms = [];
	
	/**
     * Gets the user's inputs. Do not call this if update hasn't been called previously.
     *
     */
    this.get_inputs = function(validate) {
        
        // Package the components and percentages into an array
		var components = [];
		var percentages = [];
		for (var i = 0; i < menus.length; i++) {
		
			components[i] = menus[i].get_selected();
			percentages[i] = forms[i].get_value();
		}
		
        // Block against null components with percentages and vice versa
        for (var i = 0; i < components.length; i++) {
            if (components[i] == "none" && percentages[i] != 0) percentages[i] = 0.0;
            else if (percentages[i] == 0 && components[i] != "none") components[i] = "none";
        }
        
        // Add up the percentages for checking purposes
        var sum = 0;
		for (var i = 0; i < percentages.length; i++) sum += percentages[i];
		
        // If validation is requested...
        if (validate) {
        
            // Defend against bad percentage data
            if (sum < 0) {
                new modal('<p>Not all percentage inputs are correctly formatted.</p>');
                return;
            } else if (sum != 1) {
                new modal('<p>Your percentages do not add up to 1.</p>');
                return;
            }
        }
        
        // Package all of the input into a data structure
        var data = {
            comps: components,
            pcts: percentages
        }
        
        console.log(data);
        
        return data;
    }
	
	/**
 	 * Updates the selection table and its data based on the json received
	 * from the controllers and models.
 	 */
	this.update = function(json) {
		
		// Parse the json message for the sample names
		var names = parse_json(json);
		
		// Create the selection table
		if (table) table.fnDestroy();
		table = $('#selected-compounds').dataTable({
            'ordering': false,
            'paging': false,
            'searching':false,
        });
		
		// Create the forms and dropdown menus
        for (var i = 0; i < names.sampleNames.length; i++) {
			
			forms[i] = new form(i);
			menus[i] = new dropdown(i);
			menus[i].append(names.sampleNames, names.matNames);
		}
	}
	
	/**
 	 * Parses the json message and returns a structure containing the
	 * sample names updating the selection table.
 	 */
	function parse_json(json) {
		
		var samples = json.samples;

		// Collate the sample names
        var sampleNames = [];
		var matNames = [];
        for (var i = 0; i < samples.length; i++) {
			sampleNames[i] = samples[i].name;
			matNames[i] = samples[i].matname;
		}
		
		var names = {
			sampleNames: sampleNames,
			matNames: matNames
		}
		
		return names;
	}
}