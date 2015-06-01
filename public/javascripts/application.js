/**  
 * This class is the primary engine for the distillation simulation
 * GUI. Everything JavaScript will be routed through this file into
 * main.scala.html.
 *
 */

require(['/assets/javascripts/chart.js', '/assets/javascripts/dynatable.js', '/assets/javascripts/json.js'], function(Chart){
 
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
            success : update,
            error : onError
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
                alert("Not all percentage inputs are correctly formatted.");
                return;
            } else if (sum != 1) {
                alert("Your percentages do not add up to 1.");
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
        
        console.log("Javascript viewport has been launched.");
    
        // Configure the initial data table with dummy data
        ajaxCall(getInputs(false));
        
        // Configure the run simulation button to make the ajax call
        document.getElementById("simulate").addEventListener("click", function(){
            var inputs = getInputs(true);
            if (inputs) ajaxCall(inputs);
        });
        
        // Configure the add compound button to make the ajax call
        /*document.getElementById("add-compound").addEventListener("click", function(){
            addCompound();
        });*/
        
        // Configure the sample compounds dynatable
        //$('#sample-compounds').dynatable();
        
        // Configure the selected compounds dynatable
        //$('#selected-compounds').dynatable();
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
    
        // Create the data chart with the appropriate data
        var lineChartData = {
        
            labels : response.x_axis,
            datasets : [
                {
                    label: "Reference Mixture",
                    fillColor : "rgba(220,220,220,0.2)",
                    strokeColor : "rgba(220,220,220,1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    pointHighlightFill : "#fff",
                    pointHighlightStroke : "rgba(220,220,220,1)",
                    data : response.gas
                },
                {
                    label: "My Mixture",
                    fillColor : "rgba(151,187,205,0.2)",
                    strokeColor : "rgba(151,187,205,1)",
                    pointColor : "rgba(151,187,205,1)",
                    pointStrokeColor : "#fff",
                    pointHighlightFill : "#fff",
                    pointHighlightStroke : "rgba(151,187,205,1)",
                    data : response.y_axis
                }
            ]
        };
   
        // Render the chart to HTML
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx).Line(lineChartData, {
            responsive: true,
            scaleShowLabels: true,
            scaleOverride: true,
            scaleSteps: 25,
            scaleStepWidth: 20,
            scaleStartValue: 0,
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        });
    }
    
    
    // Chart.noConflict restores the Chart global variable to it's previous owner
    // The function returns what was previously Chart, allowing you to reassign.
    var Chartjs = Chart.noConflict();
});
