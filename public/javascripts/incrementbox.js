/**
 * This class represents a form blank.
 */
function incrementbox(index) {

	var box = $('#pct' + index).stepper();

	/**
 	 * Returns the selected item in the dropdown menu.
 	 */
	this.get_value = function() {

		var num = parseInt(box.val());

		if (num) return num;
        return Number.NEGATIVE_INFINITY;
    }
	
	box[0].onchange = function() {
	
		viewport.get_selection_table().update(index, box.val());
	}
}