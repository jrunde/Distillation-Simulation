/**
 * This class represents a form blank.
 */
function incrementbox(index) {

	var box = $('#pct' + index).stepper();
	
	// TODO: for testing purposes only
  	var result = [];
  	for (var id in box) {
    	try {
      		if (typeof(box[id]) == "function") {
        		result.push(id + ": " + box[id].toString());
      		}
    	} catch (err) {
      		result.push(id + ": inaccessible");
    	}
  	}
  	//console.log(result);

	/**
 	 * Returns the selected item in the dropdown menu.
 	 */
	this.get_value = function() {

		var num = parseInt(box.val());

		if (num) return num;
        return Number.NEGATIVE_INFINITY;
    }
}