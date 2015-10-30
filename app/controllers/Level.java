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
	private ArrayList<Trial> trials;
	private ArrayList<ArrayList<Trial>> history; 
	private LevelData data;
	
	/**
	 * The default constructor creates a new level with the given number.
	 * 
	 * @param the level number
	 * 
	 */
	public Level(LevelData data) {
		
		// Initialize instantiable variables
		this.data = data;
		this.trials = new ArrayList<Trial>();
		this.history = new ArrayList<ArrayList<Trial>>();
		
		// Add a dummy header
		this.history.add(new ArrayList<Trial>());
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
		
		return data.getNum();
	}
	
	/**
	 * Accessor for the level's component data.
	 * 
	 * @return the component data for the level
	 * 
	 */
	public ArrayList<Component> getComponents() {
		
		return data.getComponents();
	}
	
	/**
	 * Accessor for the level's reference curve. Note that this curve will
	 * only be defined in terms of matlab variable names. It has no display
	 * name properties because it will never be visible to the client.
	 * 
	 * @return the reference curve for the level
	 * 
	 */
	public ArrayList<String> getReference() {
		
		return data.getReference();
	}
	
	/**
	 * Accessor for the level's reference curve component percentages.
	 * 
	 * @return the reference percentages for the level
	 * 
	 */
	public ArrayList<Double> getRefPercentages() {
		
		return data.getRefPercentages();
	}
	
	/**
	 * Accessor for the trial history.
	 * 
	 * @return the level history
	 * 
	 */
	public ArrayList<ArrayList<Trial>> getHistory() {
		
		return history;
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
		
		// Add the trial to the level history
		if (history.size() <= data.getNum()) history.add(trials);
		else history.set(data.getNum(), trials);
	}
	
	/**
	 * Switches to a new level.
	 * 
	 * @param the trial data
	 * 
	 */
	public void newLevel(LevelData data) {
		
		this.data = data;
		this.trials = new ArrayList<Trial>();
	}
}
