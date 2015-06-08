package controllers;

import java.util.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.*;
import play.mvc.*;
import views.html.*;


/**
 * Primary controller for the Distillation Simulation application. This class
 * is the entry point for the java-side models.
 * 
 */
public class Application extends Controller {

	// Create the matlab communication layer
	public static MatlabController mat = new MatlabController();

	// Create the distillation game
	public static Game game = new Game();

	/**
	 * Triggers the index home page.
	 * 
	 * @return the result of trying to render index
	 */
	public static Result index() {

		// Render the index with a simple message
		return ok(index.render("Message"));
	}

	/**
	 * The application's javascript router. This also triggers the simulation
	 * by calling the matlab controller and binding the outputs of the 
	 * calculations to the form data map.
	 * 
	 * @return the results of the simulation
	 */
	@BodyParser.Of(BodyParser.Json.class)
	public static Result ajaxCall() {
		
		// Store the form from the ajax request
		JsonNode json = request().body().asJson();
		ArrayList<String> comps = new ArrayList<String>();
		ArrayList<Double> pcts = new ArrayList<Double>();
		
		// Check for a null json request
		if (json == null) {
			return badRequest("Expecting Json data.");
		}
		
		// The json request exists
		else {
			
			// TODO: there could be more safeguards here against bad json data
			// Get an iterator to iterate through the component json array
			Iterator<JsonNode> iter = json.findPath("comps").elements();
			
			// Copy the json elements into the component list
			while (iter.hasNext()) {
				
				// Store each iteration value
				JsonNode value = iter.next();
				
				// Throw out "none" inputs
				if (!value.asText().equals("none")) 
					comps.add(value.asText());
			}
			
			// Get new iterator to step through json percentage array
			iter = json.findPath("pcts").elements();
			
			// Copy the json elements into the percentage array
			while (iter.hasNext()) {
				
				// Store each iteration value
				JsonNode value = iter.next();
				
				// Throw out "none" inputs
				if (value.asDouble() != 0) 
					pcts.add(value.asDouble());
			}
		}
		
		// Set response type to javascript
		response().setContentType("text/javascript");
		
		// Perform the simulation via matlab
		ArrayNode function = mat.calculate(comps, pcts);
			
		// If there are no errors, return the json data
		return ok(function);
	}
	
	/**
	 * The Simulation class that describes the object passed through the form
	 * pipeline. This is essentially a data structure to encapsulate the
	 * information being passed back and forth between the server and client.
	 * 
	 */
	public static class Simulation {

		public int[] inputs;
		public double[] outputs;

		/**
		 * Validates the output data.
		 * 
		 * @return the string result of the validation
		 */
		public String validate() {

			// Test criteria for validation
			if (outputs == null) { // TODO: Update this criteria...
				return null;
			}

			// If validated, return null
			return null;
		}
	}
}