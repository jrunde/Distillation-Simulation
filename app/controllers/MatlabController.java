package controllers;

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
		//.setHidden(true)
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

	/**
	 * Sets a matlab variable to the given value.
	 * 
	 * @param the String variable to be set
	 * @param the Object value of that variable
	 * @throws MatlabInvocationException 
	 * 
	 */
	public void set(String var, Object value) throws MatlabInvocationException {

		// Set the variable to the given value
		proxy.setVariable(var, value);
	}
	
	/**
	 * Gets the matlab variable with the given String name.
	 * 
	 * @param the String variable to be fetched
	 * @return the Object value of the variable
	 * @throws MatlabInvocationException 
	 * 
	 */
	public Object get(String var) throws MatlabInvocationException {

		// Get the variable
		return proxy.getVariable(var);
	}

	/**
	 * Clears the matlab workspace.
	 * 
	 * @throws MatlabInvocationException 
	 * 
	 */
	public void clear() throws MatlabInvocationException {

		// Clear the matlab workspace
		proxy.eval("clear");
		proxy.eval("close all");
	}
	
	/**
	 * Runs the Rothamer models.
	 * 
	 * @throws MatlabInvocationException 
	 * 
	 */
	public void runModels() throws MatlabInvocationException {

		// Run the script
		proxy.eval("run('./app/models/Simulate.m')");
	}
	
	/**
	 * Loads the Rothamer data tables.
	 * 
	 * @throws MatlabInvocationException 
	 * 
	 */
	public void loadData() throws MatlabInvocationException {

		// Fetch the target distillation curves
		proxy.eval("load('./app/models/Ideal_Distillations_V4.mat');");
	}
}