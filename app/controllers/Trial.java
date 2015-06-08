package controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Represents a trial for a given level. Each time the user attempts to
 * approximate a distillation curve, a new trial will be created on the back
 * end to store the attempt.
 * 
 */
public class Trial {

	// Instantiable variables
	private final ObjectNode data;
	private final int num;
	
	/**
	 * The default constructor for catalogues trial data by the number
	 * given.
	 * 
	 * @param the trial data
	 * @param the number of the trial
	 * 
	 */
	public Trial(ObjectNode data, int num) {
		
		// Initialize Instantiable variables
		this.data = data;
		this.num = num;
	}
	
	/**
	 * Accessor for the data associated with a given trial.
	 * 
	 * @return the data of the trial
	 * 
	 */
	public ObjectNode getData() {
		
		return this.data;
	}
	
	/**
	 * Accessor for the number associated with a given trial.
	 * 
	 * @return the number of the trial
	 * 
	 */
	public int getNum() {
		
		return this.num;
	}
}
