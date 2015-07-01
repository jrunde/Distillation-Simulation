/**
 * This class represents a form blank.
 */
function form(index) {
	
	var box = $('#pct' + index);
	
	/**
 	 * Returns the selected item in the dropdown menu.
 	 */
	this.get_value = function() {
    
        return parse_pct(box[0].value); // Don't know why [0] is necessary...
    }
	
	/**
     * Parses form data to make sure a double is entered.
     *
     */
    function parse_pct(num) {
    
        // Parse the raw input
        var d = parseFloat(num);
        
        // Return appropriate number
        if (!num) return 0;
        else if (isNaN(d)) return -2;
        else return d;
    }
}