package controllers;

import java.util.ArrayList;
import java.util.Iterator;
import play.libs.Json;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Ajax Controller for the Distillation Simulation back end. The class
 * provides simple functionality for sending and receiving messages and
 * commands to and from javascript.
 * 
 */
public class AjaxController {

	/**
	 * The default constructor...
	 * 
	 */
	public AjaxController() {

		// TODO: add something here?
	}

	/**
	 * Parses the json request to get the user input data and feeds this
	 * to the handling function. It returns the result of the handle.
	 * 
	 * @param the json request
	 * @return the json response
	 * 
	 */
	public ObjectNode parse(JsonNode json) {

		// Check for a null json request
		if (json == null) return null;

		// Create data structures to store the component and percent inputs
		ArrayList<String> comps = new ArrayList<String>();
		ArrayList<Double> pcts = new ArrayList<Double>();

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

		// Handle the request and return the json message
		return handle(comps, pcts);
	}
	
	/**
	 * Takes in user input and builds the appropriate json response. It also
	 * tells the game to calculate a simulation trial if the user trial input
	 * is valid.
	 * 
	 * @param the user's input components
	 * @param the user's input percentages
	 * @return the json response
	 * 
	 */
	private ObjectNode handle(ArrayList<String> comps, ArrayList<Double> pcts) {
		
		// If inputs exist, perform the simulation
		if (!comps.isEmpty()) Application.game.calculate(comps, pcts);
		
		// Build the json message from the trial data
		ArrayList<Trial> trials = Application.game.getLevel().getTrials();
		
		// Create the json structures to return the data
		ObjectNode response = Json.newObject();
		ArrayNode data = new ArrayNode(null);
		
		// Step through the trial data
		for (int i = 0; i < trials.size(); i++) {
			
			// Create a new json trial object
			ObjectNode trial = Json.newObject();
			
			// Place all the relevant data into the object
			trial.put("x_axis", Json.toJson(trials.get(i).getX()));
			trial.put("y_axis", Json.toJson(trials.get(i).getY()));
			trial.put("gas", Json.toJson(trials.get(i).getGas()));
			trial.put("score", Json.toJson(trials.get(i).getScore()));
			trial.put("comps", Json.toJson(trials.get(i).getComps()));
			trial.put("pcts", Json.toJson(trials.get(i).getPcts()));
			trial.put("num", Json.toJson(i));
			
			// Add the object to the data array
			data.add(trial);
		}
		
		// Add the data and level to the json response
		response.put("data", data);
		response.put("level", Application.game.getLevel().getNumber());
		
		return response;
	}
}
