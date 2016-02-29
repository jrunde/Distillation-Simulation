package controllers;

import java.util.*;
import java.util.Map.Entry;
import com.fasterxml.jackson.databind.node.*;
import play.mvc.*;
import views.html.*;

/**
 * Primary controller for the Distillation Simulation application. This class
 * is the entry point for the java-side models.
 * 
 */
public class Application extends Controller {

	// Global constants
	public static final int ONE_DAY = 86400;
	
	// Create the ajax controller
	public static AjaxController ajax = new AjaxController();

	// Create the distillation games array
	public static Hashtable<String, Game> games = new Hashtable<String, Game>();

	/**
	 * Triggers the landing page.
	 * 
	 * @return the result of trying to render landing
	 */
	public static Result landing() {

		// TODO: This may be horribly inefficient...
		garbageCollect();
		
		// Render the index with a simple message
		return ok(landing.render());
	}

	/**
	 * Triggers the help page.
	 * 
	 * @return the result of trying to render help
	 */
	public static Result help() {
		
		// Render the index with a simple message
		return ok(help.render());
	}
	
	/**
	 * Triggers the index home page.
	 * 
	 * @return the result of trying to render index
	 */
	public static Result index() {

		// Render the index with a simple message
		return ok(index.render());
	}

	/**
	 * The application's javascript router. This passes ajax calls onto the
	 * ajax controller for proper parsing and handling. It returns the json
	 * response.
	 * 
	 * @return the results of the simulation
	 */
	@BodyParser.Of(BodyParser.Json.class)
	public static Result ajaxCall(String id) {

		// Set response type to javascript
		response().setContentType("text/javascript");

		// Parse the ajax request
		ObjectNode response = ajax.handle(request().body().asJson(), id);

		// Return the json response
		return ok(response);
	}

	/**
	 * Removes the game and cleans up after matlab.
	 * 
	 */
	public static void remove(String id) {

		// Kill the game
		games.get(id).destroy();
		games.remove(id);

		// Log the remaining games
		String message = "Games remaining:\n\tString ID:\t\t\tLast Stamp:\n";
		Object[] names = games.keySet().toArray();
		for (int i = 0; i < names.length; i++) {
			message += ("\t" + (String) names[i] + "\t\t\t" + 
					games.get(i).getLastStamp() + "\n");
		}
		log(message);
	}

	/**
	 * Logs the message in the terminal.
	 * 
	 * @param the message to be displayed.
	 * 
	 */
	public static void log(String message) {

		String[] lines = message.split("\n");

		for (int i = 0; i < lines.length; i++)
			System.out.println("[Dist-Sim] " + lines[i]);

		System.out.println("[Dist-Sim]");
	}
	
	/**
	 * Kills off all of the old games that are no longer being used.
	 * 
	 */
	public static void garbageCollect() {

		String message = "Garbage collecting. Games deleted:\n" +
				"\tString ID:\t\t\tLast Stamp:\n";
		
		long stamp = (new Date().getTime()) / 1000;
		
		Iterator<Entry<String, Game>> iter = games.entrySet().iterator();
		while (iter.hasNext()) {
			
			Game curr = iter.next().getValue();
			if (stamp - curr.getLastStamp() > ONE_DAY) {
				
				message += ("\t" + curr.getID() + "\t\t\t" + 
						curr.getLastStamp() + "\n");
				remove(curr.getID());
			}
		}
		
		// Log the status
		log(message);
	}
}