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
	public ObjectNode handle(JsonNode json, String id) {
		
		// Block against bad data
		if (json == null) return null;
		if (id == null) return null;

		// If this is the first request for this game
		if (!Application.games.containsKey(id)){
			
			// Create the game!
			Application.log("A new game has been created with id: " + id);
			Application.games.put(id, new Game(id));
			
			// Log all current games
			String message = "Games running:\n\tString ID:\t\t\tLast Stamp:\n";
			Object[] names = Application.games.keySet().toArray();
			for (int i = 0; i < names.length; i++) 
				message += ("\t" + (String) names[i] + "\t\t\t" + 
						Application.games.get(names[i]).getLastStamp() + "\n");
			Application.log(message);
		}
		Game game = Application.games.get(id);
		
		// Time-stamp the handle (for garbage collecting purposes)
		game.stamp();
		
		// Create a response object and store the task label
		ObjectNode response = null;
		String task = json.findPath("task").asText();

		// Execute the method cooresponding to the task label
		if (task.equalsIgnoreCase("update")) 
			response = update(json.findPath("inputs"), game);
		else if (task.equalsIgnoreCase("advance")) response = advance(game);
		else if (task.equalsIgnoreCase("quit")) response = end("quit", game);
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
	 * @param the game in question
	 * @return the json response
	 * 
	 */
	private ObjectNode update(JsonNode json, Game game) {

		// Check if game is over
		if (game.isOver()) return end("complete", game);
		
		// Parse the request based on user input
		ArrayList<String> comps = new ArrayList<String>();
		ArrayList<Double> pcts = new ArrayList<Double>();
		
		if (json != null && json.findPath("comps") != null &&
				json.findPath("pcts") != null) {

			// Copy the json elements into the component list
			Iterator<JsonNode> iter = json.findPath("comps").elements();
			while (iter.hasNext()) {
				
				// Throw out "none" and null inputs
				JsonNode value = iter.next();
				if (!value.asText().equals("null") && !value.asText().equals("none"))
					comps.add(value.asText());
			}

			// Copy the json elements into the percentage array
			iter = json.findPath("pcts").elements();	
			while (iter.hasNext()) {

				// Throw out "none" inputs
				JsonNode value = iter.next();
				if (value.asDouble() != 0) pcts.add(value.asDouble());
			}
		}

		// Perform the simulation
		if (!comps.isEmpty()) game.calculate(comps, pcts);

		// Build the json message from the trial data
		ArrayList<Trial> trials = game.getLevel().getTrials();
		ObjectNode response = Json.newObject();
		ArrayNode data = new ArrayNode(null);
		ArrayNode samples = new ArrayNode(null);

		// Step through the trial data
		for (int i = 0; i < trials.size(); i++) {

			// Place all the relevant data into an object
			ObjectNode trial = Json.newObject();
			
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
				game.getLevel().getComponents();
		for (int i = 0; i < sampleCmps.size(); i++) {
			
			// Place all the relevant data into the object
			ObjectNode sampleCmp = Json.newObject();
				
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
		response.put("level", game.getLevel().getNumber());

		return response;
	}

	/**
	 * Tells the game to advance to the next level.
	 * 
	 * @param the game in question
	 * @return the json response
	 * 
	 */
	private ObjectNode advance(Game game) {

		// Advance the game to the next level
		game.advanceLevel();

		// Update the client side
		return update(null, game);
	}
	
	/**
	 * Ends the game.
	 * 
	 * @param the end mode
	 * @param the game in question
	 * @return the json response
	 * 
	 */
	private ObjectNode end(String mode, Game game) {

		// Create the json structures to return the data
		ObjectNode response = Json.newObject();
		
		// If the game is quit, deallocate it's memory
		if (mode.equalsIgnoreCase("quit")) Application.remove(game.getID());
	
		// Add the data and level to the json response
		response.put("end_mode", mode);

		return response;
	}
}
