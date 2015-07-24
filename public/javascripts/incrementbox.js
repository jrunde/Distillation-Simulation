/**
 * This class represents a form blank.
 */
function incrementbox(index) {

	var box = $('#pct' + index).stepper();
	var value;

	// Set up the box's onchange function
	box[0].onchange = function() {
		
		// Check if more than four components will be used
		var data = viewport.get_selection_table().get_data();
		if (data.length >= 4 && !value && parseInt(box.val()) >= 5) {
			
			box[0].value = 0;
			new modal('You may only choose four different ' + 
				'components for your mixture', ['Ok']);
			return;
		}
		
		// Check if user percentages will exceed 100
		var sum = 0;
		for (var i = 0; i < data.length; i++) {
			
			sum += parseInt(data[i][3]);
			if (sum >= 100 && parseInt(box.val()) > value) {
	
				box[0].value = value;
				return;
			}
		}
		
		// Update internal value
		value = parseInt(box.val());
		
		// Add the input to the selection table
		viewport.get_selection_table().add(index, value);
	}
}