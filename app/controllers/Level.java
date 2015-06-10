package controllers;

import java.util.*;

/**
 * Represents a level of the user's distillation simulation game. This
 * structure is mainly a database for the trial data that the user has
 * submitted.
 * 
 */
public class Level {

	// Instantiable variables
	private int level;
	private ArrayList<Trial> trials;
	
	/**
	 * The default constructor creates a new level with the given number.
	 * 
	 * @param the level number
	 * 
	 */
	public Level(int num) {
		
		// Initialize instantiable variables
		level = num;
		trials = new ArrayList<Trial>();
	}
	
	/**
	 * Accessor for the level's trial data.
	 * 
	 * @return an array list of the previous trials
	 * 
	 */
	public ArrayList<Trial> getTrials() {
		
		return trials;
	}
	
	
	/**
	 * Accessor for the level's number, i.e. how far along into the game
	 * the user is.
	 * 
	 * @return the level number of the game
	 * 
	 */
	public int getNumber() {
		
		return level;
	}
	
	/**
	 * Adds a new trial to the trial data for the level.
	 * 
	 * @param the trial data
	 * @param the number of the trial
	 * 
	 */
	public void addTrial(double[] x_axis, double[] y_axis, double[] gas,
			Double score, String[] comps, Double[] pcts, int num) {
		
		// Add the trial data as a new trial
		trials.add(new Trial(x_axis, y_axis, gas, score, comps, pcts, num));
	}
}
