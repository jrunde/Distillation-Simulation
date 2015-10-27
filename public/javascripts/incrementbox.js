/**
 * This class represents a form blank.
 */
function incrementbox(index, val) {

	var box = $('#pct' + index).stepper();
	var value;
	
	// Set the box's initial value
	box[0].value = val;
	
	// Set up the box's onchange function
	box[0].onchange = function() {
		
		// Get the selection table data
		var forms = viewport.get_selection_table().get_forms();

		// Check if user percentages will exceed 100
		var sum = 0;
		for (var i = 0; i < forms.length; i++) {
			
			if (forms[i]) sum += forms[i].get_value();
			if (sum > 100 && parseInt(box.val()) > value) {
	
				box[0].value = value;
				return;
			}
		}
		
		// Update internal value
		value = parseInt(box.val());
		if (isNaN(value)) {
			value = 0;
			box[0].value = value;
			return;
		}
		
		// Update percentages array
		viewport.get_selection_table().update_form(index, value);
	}
	
	/**
 	 * Access the value of the increment box.
 	 */
	this.get_value = function() {
		
		return parseInt(box.val());
	}
}