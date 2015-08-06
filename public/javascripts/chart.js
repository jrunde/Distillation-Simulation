/**
 * This class represents the chart by wrapping the chartnew plugin.
 */
function chart() {
	
	var context = document.getElementById("canvas").getContext("2d");
	
	/**
     * Updates the chart based on the data passed in.
     */
	this.update = function(json) {
		
		// Parse the json message and package data for chartnew
		var data = parse_json(json);
		
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
            legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\">' + 
				'<% for (var i=0; i<datasets.length; i++){%><li><span style=' + 
				'\"background-color:<%=datasets[i].strokeColor%>\"></span>' +
				'<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        });
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
        var lineData = [
            {
                label: "Reference Mixture",
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: trials[trialNum].gas,
                title: "Gasoline",
            }
        ];
		
		if (trialNum > 0) {
        
            // Fill the user distillation curve into the line data
            lineData[1] = {
                label: "Your Mixture",
                fillColor: "rgba(183,1,1,0)",
                strokeColor: "rgba(183,1,1,1)",
                pointColor: "rgba(183,1,1,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(183,1,1,1)",
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