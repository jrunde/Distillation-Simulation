package controllers;

import java.util.*;
import play.libs.Json;

import com.fasterxml.jackson.databind.JsonNode;
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
	 * @return the result of the Matlab calculation
	 */
	public ObjectNode calculate(ArrayList<String> components, ArrayList<Double> percentages) {

		Object recovered = null;
		Object t1 = null;
		Object tsummerd86 = null;

		try {

			// Refactor the user input data
			String[] comps = new String[components.size()];
			Double[] pcts = new Double[percentages.size()];
			comps = components.toArray(comps);
			pcts = percentages.toArray(pcts);

			// Clear the matlab workspace
			proxy.eval("clear all");
			proxy.eval("close all");

			// If there are no inputs at all...
			if (components.size() < 1) {

				// Fetch the target distillation curve
				proxy.eval("load('./app/models/Ideal_Distillations_V4.mat');");
				tsummerd86 = proxy.getVariable("T_summerD86");
				
				// TODO: More graceful way to do this?
				// Fetch the recovered spread
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
		ObjectNode function = Json.newObject();
		JsonNode x_axis = Json.toJson((double[]) recovered);
		JsonNode y_axis = Json.toJson((double[]) t1);
		JsonNode gas = Json.toJson((double[]) tsummerd86);
		function.put("x_axis", x_axis);
		function.put("y_axis", y_axis);
		function.put("gas", gas);

		// Return the json object node
		return function;
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