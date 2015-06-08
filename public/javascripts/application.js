/**  
 * This class is the primary engine for the distillation simulation
 * GUI. Everything JavaScript will be routed through this file into
 * main.scala.html.
 *
 */
require.config({
    paths: {
        'datatables': '/assets/javascripts/dataTables',
        'gridster': '/assets/javascripts/gridster',
        'gridster-collision': '/assets/javascripts/collision',
        'gridster-draggable': '/assets/javascripts/draggable',
        'gridster-coords': '/assets/javascripts/coords',
        'gridster-utils': '/assets/javascripts/utils',
        'avgrund': '/assets/javascripts/avgrund'
    }
});

require(['/assets/javascripts/chartnew.js',
        '/assets/javascripts/json.js',
        'datatables',
        'gridster',
        'gridster-collision',
        'gridster-draggable',
        'gridster-coords',
        'gridster-utils',
        'avgrund'
    ], function(){

    // Instatiable variables
    var trials;
    
    /**
     * Makes an ajax call.
     *
     */
    var ajaxCall = function(components) {
        
        var ajaxCallBack = {
            method: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(components),
            success: update,
            error: onError
        }
 
        jsRoutes.controllers.Application.ajaxCall().ajax(ajaxCallBack);
    };
 
    /**
     * Handles an ajax error.
     *
     */
    var onError = function(error) {
        console.log("Error");
        console.log(error);
    }
    
    /**
     * Handles an ajax error.
     *
     */
    var avgrund = function(message) {
        
        // Configure the avgrund modal window layer
        $('#simulate').avgrund({
			height: 200,
			holderClass: 'custom',
			showClose: true,
            showCloseText: 'Close',
            closeByEscape: true,
            closeByDocument: true,
			enableStackAnimation: true,
			onBlurContainer: '.container',
            openOnEvent: false,
            template: message
		});
    }

    /**
     * Adds a compound to the mixture list.
     *
     */
    var addCompound = function() {


    }
    
    /**
     * Parses form data to make sure a double is entered.
     *
     */
    var parsePct = function(num) {
    
        // Parse the raw input
        var d = parseFloat(num);
        
        // Return appropriate number
        if (!num) return 0;
        else if (isNaN(d)) return -2;
        else return d;
    }
    
    /**
     * Gets the component inputs.
     *
     */
    var getInputs = function(validate) {

        // Get all of the dropdown menus
        var select1 = document.getElementById("comp1");
        var select2 = document.getElementById("comp2");
        var select3 = document.getElementById("comp3");
        var select4 = document.getElementById("comp4");
        
        // Get all of the form fields
        var form1 = document.getElementById("pct1");
        var form2 = document.getElementById("pct2");
        var form3 = document.getElementById("pct3");
        var form4 = document.getElementById("pct4");
        
        // Package the components into an array
        var components = [
            select1.options[select1.selectedIndex].value,
            select2.options[select2.selectedIndex].value,
            select3.options[select3.selectedIndex].value,
            select4.options[select4.selectedIndex].value
        ];
        
        // Package the percentages into an array
        var percentages = [
            parsePct(form1.value),
            parsePct(form2.value),
            parsePct(form3.value),
            parsePct(form4.value)
        ];
        
        // Block against null components with percentages and vice versa
        for (var i = 0; i < components.length; i++) {
            if (components[i] == "none" && percentages[i] != 0) percentages[i] = 0.0;
            else if (percentages[i] == 0 && components[i] != "none") components[i] = "none";
        }
        
        // Add up the percentages for checking purposes
        var sum = percentages[0] + percentages[1] + percentages[2] + percentages[3];

        // If validation is requested...
        if (validate) {
        
            // Defend against bad percentage data
            if (sum < 0) {
                avgrund('<p>Not all percentage inputs are correctly formatted.</p>');
                return;
            } else if (sum != 1) {
                avgrund('<p>Your percentages do not add up to 1.</p>');
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
     * Document on ready function. This is essentially the main function
     * for the java script code.
     *
     */
    $(function() {
      
        launch();
    });
    
    /**
     * Launches the viewport.
     *
     */
    function launch() {
    
        // Configure the initial data table with dummy data
        ajaxCall(getInputs(false));
        
        // Configure the run simulation button to make the ajax call
        document.getElementById('simulate').addEventListener('click', function(){
            
            // Get the user's component inputs
            var inputs = getInputs(true);
            
            // If the input is valid...
            if (inputs) {
            
                // Send the data to the model
                ajaxCall(inputs);
                
                // Print an avgrund modal message
                avgrund('<p>Calculating your distillation curve. Results will appear shortly.');
            }
        });
        
        // Configure the sample compounds data table
        $('#sample-compounds').dataTable({
            'paging': false,
            'searching':false,
        });
        
        // Configure the selected compounds data table
        $('#selected-compounds').dataTable({
            'ordering': false,
            'paging': false,
            'searching':false,
        });
        
        // Configure the trials data table
        trials = $('#trials').dataTable({
            'ordering': true,
            'paging': false,
            'searching':false,
        });
        
        // Configure the layout grid
        $('.gridster ul').gridster({
            autogrow_cols: true,
            widget_margins: [20, 20],
            widget_base_dimensions: [600, 100]
        }).data('gridster').disable();
    }

    /**
     * Updates the chart with the ajax return data
     *
     */
    function update(response) {
        
        // Block against null data
        if (!response) return;
        
        // Do some quick refactoring
        console.log(response);
        
        // Store the current trial number
        var curr = response.length - 1;
        
        // Add the trial data to the trial chart
        if (response.y_axis) {
        
        }
        
        // Generate the initial chart data
        var chartData = [
            {
                label: "Reference Mixture",
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: response[curr].gas,
                title: "Gasoline",
            }
        ];
        
        // If the user has submitted at least one trial...
        if (curr > 0) {
        
            // Fill the user distillation curve into the chart
            chartData[1] = {
                label: "Your Mixture",
                fillColor: "rgba(183,1,1,0)",
                strokeColor: "rgba(183,1,1,1)",
                pointColor: "rgba(183,1,1,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(183,1,1,1)",
                data: response[curr].y_axis,
                title: "Your Mixture"
            };
        
            // Create an array for the trial data table backend
            var trialData = [
                'Trial ' + curr,
                0.0,
                0.0,
                0.0,
                0.0,
                response[curr].score + '%'
            ];
        
            // Step through the user component percentages
            for (var i = 0; i < response[curr].pcts.length; i++) {
        
                // If the pct is not null, place it in the trialData array
                if (response[curr].pcts[i]) trialData[i + 1] = response[curr].pcts[i];
            }
        
            // Fill the user trial data into the table
            trials.fnAddData(trialData, true);
        }
        
        // Create the data chart with the appropriate data
        var lineChartData = {
            labels: response[curr].x_axis,
            datasets: chartData
        };
   
        // Render the chart to HTML
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx).Line(lineChartData, {
            graphTitle: "Simulated Distillation Curve",
            yAxisLabel: "Recovered Temperature (K)",
            xAxisLabel: "Percent Evaporated (%)",
            legend: true,
            responsive: true,
            scaleShowLabels: true,
            scaleOverride: true,
            scaleSteps: 25,
            scaleStepWidth: 20,
            scaleStartValue: 0,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        });
    }
});
