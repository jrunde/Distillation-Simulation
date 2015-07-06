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
	 * Handles the json request and passes it on to the appropriate helper
	 * function before returning the resulting data.
	 * 
	 * @param the json request
	 * @return the json response
	 * 
	 */
	public ObjectNode handle(JsonNode json) {

		// Check for a null json request
		if (json == null) return null;

		// Create a response object and store the task label
		ObjectNode response = null;
		String task = json.findPath("task").asText();

		// Execute the method cooresponding to the task label
		if (task.equalsIgnoreCase("update")) 
			response = update(json.findPath("inputs"));
		else if (task.equalsIgnoreCase("advance")) response = advance();
		else if (task.equalsIgnoreCase("quit")) response = end("quit");
		else return null;

		// Return the json response
		return response;
	}

	/**
	 * Parses the json request into user input and builds the appropriate json
	 * response. It also tells the game to calculate a simulation trial if the
	 * user trial input is valid.
	 * 
	 * @param the json request
	 * @return the json response
	 * 
	 */
	private ObjectNode update(JsonNode json) {

		// Check if game is over
		if (Application.game.isOver()) return end("complete");
		
		// Create data structures to store the component and percent inputs
		ArrayList<String> comps = new ArrayList<String>();
		ArrayList<Double> pcts = new ArrayList<Double>();

		// Parse the request only if the input is articulated
		if (json != null && json.findPath("comps") != null &&
				json.findPath("pcts") != null) {

			// Get an iterator to iterate through the component json array
			Iterator<JsonNode> iter = json.findPath("comps").elements();

			// Copy the json elements into the component list
			while (iter.hasNext()) {

				// Store each iteration value
				JsonNode value = iter.next();

				// Throw out "none" inputs
				if (!value.asText().equals("none")) comps.add(value.asText());
			}

			// Get new iterator to step through json percentage array
			iter = json.findPath("pcts").elements();

			// Copy the json elements into the percentage array
			while (iter.hasNext()) {

				// Store each iteration value
				JsonNode value = iter.next();

				// Throw out "none" inputs
				if (value.asDouble() != 0) pcts.add(value.asDouble());
			}
		}

		// If inputs exist, perform the simulation
		if (!comps.isEmpty()) Application.game.calculate(comps, pcts);

		// Build the json message from the trial data
		ArrayList<Trial> trials = Application.game.getLevel().getTrials();

		// Create the json structures to return the data
		ObjectNode response = Json.newObject();
		ArrayNode data = new ArrayNode(null);
		ArrayNode samples = new ArrayNode(null);

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
		
		// Step through the sample data for the level
		ArrayList<Component> sampleCmps = 
				Application.game.getLevel().getComponents();
		
		for (int i = 0; i < sampleCmps.size(); i++) {
			
			// Create a new sample component object
			ObjectNode sampleCmp = Json.newObject();
			
			// Place all the relevant data into the object
			sampleCmp.put("name", sampleCmps.get(i).getName());
			sampleCmp.put("matname", sampleCmps.get(i).getMatlabName());
			sampleCmp.put("boilpoint", sampleCmps.get(i).getBoilingPoint());
			sampleCmp.put("mass", sampleCmps.get(i).getMass());
			
			// Add the object to the sample component array
			samples.add(sampleCmp);
		}

		// Add the data and level to the json response
		response.put("data", data);
		response.put("samples", samples);
		response.put("level", Application.game.getLevel().getNumber());

		return response;
	}

	/**
	 * Tells the game to advance to the next level.
	 * 
	 * @return the json response
	 * 
	 */
	private ObjectNode advance() {

		// Advance the game to the next level
		Application.game.advanceLevel();

		// Update the client side
		return update(null);
	}
	
	/**
	 * Ends the game.
	 * 
	 * @param the end mode
	 * @return the json response
	 * 
	 */
	private ObjectNode end(String mode) {

		// Create the json structures to return the data
		ObjectNode response = Json.newObject();
		
		// If the game is quit, deallocate it's memory
		if (mode.equalsIgnoreCase("quit")) Application.remove();
	
		// Add the data and level to the json response
		response.put("end_mode", mode);

		return response;
	}
}
