package controllers;

import java.util.*;

import play.libs.Json;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import matlabcontrol.*;

/**
 * Matlab Controller for the Distillation Simulation back end. The class
 * provides simple functionality for sending and receiving messages and
 * commands to and from matlab.
 * 
 */
public class MatlabController {

	private MatlabProxyFactoryOptions options;
	private MatlabProxyFactory factory;
	private MatlabProxy proxy;

	/**
	 * The default constructor creates a factory and proxy.
	 * 
	 */
	public MatlabController() {

		// Create a proxy factory with specified options
		options = new MatlabProxyFactoryOptions.Builder()
		.setHidden(true)
		//.setProxyTimeout(30000L)
		.build();
		factory = new MatlabProxyFactory(options);

		try {

			// Get a proxy from the factory
			proxy = factory.getProxy();
		} 

		catch (MatlabConnectionException e) {

			// On failure, print stack trace
			e.printStackTrace();
		}
	}

	/**
	 * Calls the matlab session and performs the distillation function.
	 * 
	 * @param the chemical inputs into the distillation
	 * @return the result of the Matlab calculations returned in json form
	 */
	public ArrayNode calculate(ArrayList<String> components, ArrayList<Double> percentages) {

		Object recovered = null;
		Object t1 = null;
		Object tsummerd86 = null;
		Object score = 88.0; // TODO: plug this into the models
		int trialNum = Application.game.getLevel().getTrials().size() + 1;

		// Refactor the user input data
		String[] comps = new String[components.size()];
		Double[] pcts = new Double[percentages.size()];
		comps = components.toArray(comps);
		pcts = percentages.toArray(pcts);

		try {

			// Clear the matlab workspace
			proxy.eval("clear all");
			proxy.eval("close all");

			// If there are no inputs at all...
			if (components.size() < 1) {

				// Fetch the target distillation curve
				proxy.eval("load('./app/models/Ideal_Distillations_V4.mat');");
				tsummerd86 = proxy.getVariable("T_summerD86");

				// TODO: More graceful way to do this?
				// Fetch the recovered percentage spread
				double[] x = {0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100};
				recovered = x;
			}

			// Otherwise...
			else {

				// Pass in the user input
				proxy.setVariable("n", comps.length);
				proxy.setVariable("cmp", comps);
				proxy.setVariable("pct", pcts);

				// Run the script
				proxy.eval("run('./app/models/Simulate.m')");

				// Store the outputs
				recovered = proxy.getVariable("recovered");
				t1 = proxy.getVariable("T1");
				tsummerd86 = proxy.getVariable("T_summerD86");
			}
		} 

		catch (MatlabInvocationException e) {

			// On failure, print stack trace
			e.printStackTrace();
		}

		catch (Exception e) {

			// On failure, print stack trace
			e.printStackTrace();
		}

		// Create the json structure to return the data
		ArrayNode data = new ArrayNode(null);

		// Put all the old trial data for the current level into the json
		for (int i = 0; 
				i < Application.game.getLevel().getTrials().size(); i++){

			// Add the indexed trial to the data object
			data.add(Application.game.getLevel().getTrials().get(i).getData());
		}

		// If the user entered inputs or it is a new level...
		if (components.size() > 0 || 
				Application.game.getLevel().getTrials().isEmpty()) {

			// Place all this trial's data into the trial json object
			ObjectNode trial = Json.newObject();
			trial.put("x_axis", Json.toJson((double[]) recovered));
			trial.put("y_axis", Json.toJson((double[]) t1));
			trial.put("gas", Json.toJson((double[]) tsummerd86));
			trial.put("score", Json.toJson((Double) score));
			trial.put("comps", Json.toJson(comps));
			trial.put("pcts", Json.toJson(pcts));
			trial.put("num", Json.toJson(trialNum));

			// Add the trial to the current level's trial history
			Application.game.getLevel().addTrial(trial, trialNum);

			// Add the trial to the data json object
			data.add(trial);
		}

		// Return the json object node
		return data;
	}

	/**
	 * Disconnects the Matlab proxy.
	 * 
	 */
	public void disconnect() {

		// Disconnect the proxy from matlab
		proxy.disconnect();
	}

	/**
	 * Exits the matlab session.
	 * 
	 */
	public void exit() {

		try {

			// Exit matlab
			proxy.exit();
		} 

		catch (MatlabInvocationException e) {

			// On failure, print stack trace
			e.printStackTrace();
		}
	}
}