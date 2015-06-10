package controllers;

import com.fasterxml.jackson.databind.node.*;
import play.mvc.*;
import views.html.*;

/**
 * Primary controller for the Distillation Simulation application. This class
 * is the entry point for the java-side models.
 * 
 */
public class Application extends Controller {

	// Create the ajax controller
	public static AjaxController ajax = new AjaxController();
	
	// Create the distillation game
	public static Game game = new Game();

	/**
	 * Triggers the landing page.
	 * 
	 * @return the result of trying to render index
	 */
	public static Result landing() {

		// Render the index with a simple message
		return ok(landing.render());
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
	public static Result ajaxCall() {
		
		// Set response type to javascript
		response().setContentType("text/javascript");
		
		// Parse the ajax request
		ObjectNode response = ajax.parse(request().body().asJson());
		
		// Return the json response
		return ok(response);
	}
}