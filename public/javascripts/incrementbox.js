/**
 * This class represents a form blank.
 */
function incrementbox(index) {

	var box = $('#pct' + index).stepper();
	var value;

	// Set up the box's onchange function
	box[0].onchange = function() {
		
		// Check if user percentages will exceed 100
		var sum = 0;
		var data = viewport.get_selection_table().get_data();
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