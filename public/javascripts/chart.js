/**
 * This class represents the chart by wrapping the chartnew plugin.
 */
function chart() {
	
	var target;
	var context = document.getElementById('canvas').getContext("2d");
	var canvas = document.getElementById('canvas');
	canvas.style.width = '600px';
	canvas.style.height = '600px';
	canvas.width = 600;
	canvas.height = 600;
	
	/**
     * Updates the chart based on the data passed in.
     */
	this.update = function(json) {
		
		// Parse the json message and package data for chartnew
		var data = parse_json(json);
		
		// Make sure canvas doesn't go wonky
		canvas.style.width = '600px';
		canvas.style.height = '600px';
		canvas.width = 600;
		canvas.height = 600;
		
		// Create the chart and render it to HTML
        window.myLine = new Chart(context).Line(data, {
            graphTitle: "Simulated Distillation Curve",
            yAxisLabel: "Recovered Temperature (K)",
            xAxisLabel: "Percent Evaporated (%)",
            legend: true,
            responsive: true,
            scaleShowLabels: true,
            scaleOverride: true,
            scaleSteps: 20,
            scaleStepWidth: 10,
            scaleStartValue: 250,
        });
	}
	
	/**
     * Removes the chart from the viewport.
     */
	this.destroy = function() {
		
		canvas.remove();
	}
	
	/**
     * Sets the target reference curve.
     */
	this.show_target = function(reference) {
		
		target = reference;
	}
	
	/**
     * Parses the json message and constructs the appropriate 
	 * data structures to pass over to chartnew.
     */
	function parse_json(json) {
		
		// Store for simplification
		var trialNum = json.data.length - 1;
        var trials = json.data;
		
		// Generate the reference curve line data
		var data;
		if (target == null) data = trials[trialNum].gas;
		else data = target;
        var lineData = [
            {
                label: "Reference Fossil Fuel",
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: data,
                title: "Gasoline",
            }
        ];
		
		if (trialNum > 0) {
        
            // Fill the user distillation curve into the line data
            lineData[1] = {
                label: "Your Biofuel Mixture",
                fillColor: "rgba(39,96,146,0)",
                strokeColor: "rgba(39,96,146,1)",
                pointColor: "rgba(39,96,146,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(39,96,146,1)",
                data: trials[trialNum].y_axis,
                title: "Your Mixture"
            };
		}
		
		// Do final packaging of chart data
		var chartData = {
            labels: trials[trialNum].x_axis,
            datasets: lineData
        };
		
		return chartData;
	}
}