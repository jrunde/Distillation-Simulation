/**
 * This class represents a dropdown menu by wrapping the selectric
 * plugin.
 */
function dropdown(index) {
	
	var menu = $('#comp' + index).selectric();
	var samples;
	var matnames;
	
	/**
 	 * Appends the samples in the array as options in the menu.
 	 */
	this.append = function(sampleNames, matNames) {
    
        if (!sampleNames) return;
		samples = sampleNames;
		matnames = matNames;
		
        menu.append('<option>---</option>').selectric();
        
		for (var i = 0; i < sampleNames.length; i++)
            menu.append('<option>' + sampleNames[i] + '</option>').selectric();
    }
	
	/**
 	 * Returns the matlab name of the selected item in the dropdown menu.
 	 */
	this.get_selected = function() {
    
		var selected = menu.val();
		
		for (var i = 0; i < samples.length; i++) {
			
			if (samples[i] == selected) return matnames[i];
		}
		
		return 'none';
    }
}