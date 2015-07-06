package controllers;

import java.util.*;
import matlabcontrol.MatlabInvocationException;

/**
 * Representation of a distillation simulation game. This is the object that
 * serves as the database for a user's game, as well as controls the game flow.
 * 
 */
public class Game {

	// Game constants
	public static final int LAST_LEVEL = 4;

	// Instantiable variables
	private MatlabController mat;
	private Level level;
	private boolean isOver;

	/**
	 * The default constructor creates the game's first level.
	 * 
	 */
	public Game() {

		// Initialize the instantiable variables
		mat = new MatlabController();
		level = new Level(new LevelData(1));
		isOver = false;

		// Initialize the new level
		initLevel();
	}

	/**
	 * Uses the matlab controller to initialize the current level by
	 * calculating the target curve from the matlab models and storing it
	 * into the new level trial data.
	 * 
	 */
	private void initLevel() {

		Object recovered = null;
		Object t1 = null;

		// Refactor the user input data
		String[] comps = new String[level.getReference().size()];
		Double[] pcts = new Double[level.getRefPercentages().size()];
		comps = level.getReference().toArray(comps);
		pcts = level.getRefPercentages().toArray(pcts);

		try {

			// Clear the matlab workspace
			mat.clear();

			// Pass in the user input
			mat.set("n", comps.length);
			mat.set("cmp", comps);
			mat.set("pct", pcts);

			// Run the script
			mat.runModels();

			// Store the outputs
			recovered = mat.get("recovered");
			t1 = mat.get("T1");
		} 

		catch (MatlabInvocationException e) {

			// On failure, print stack trace
			e.printStackTrace();
		}

		// Store the data as the zeroth trial
		level.addTrial((double[]) recovered, null, (double[]) t1,
				null, null, null, 0);
	}

	/**
	 * Uses the matlab controller to calculate the distillation simulation
	 * function based on the given user inputs. It then stores the data
	 * into the trial data structures.
	 * 
	 * @param the chemical inputs into the distillation
	 * @return the result of the Matlab calculations returned in json form
	 */
	public void calculate(ArrayList<String> components, ArrayList<Double> percentages) {

		Object recovered = null;
		Object t1 = null;
		Object score = null;
		int trialNum = level.getTrials().size() + 1;

		// Refactor the user input data
		String[] comps = new String[components.size()];
		Double[] pcts = new Double[percentages.size()];
		comps = components.toArray(comps);
		pcts = percentages.toArray(pcts);

		try {

			// Clear the matlab workspace
			mat.clear();

			// Pass in the user input
			mat.set("n", comps.length);
			mat.set("cmp", comps);
			mat.set("pct", pcts);

			// Run the script
			mat.runModels();

			// Store the outputs
			recovered = mat.get("recovered");
			t1 = mat.get("T1");
		} 

		catch (MatlabInvocationException e) {

			// On failure, print stack trace
			e.printStackTrace();
		}

		// Grab the reference curve
		double[] ref = level.getTrials().get(0).getGas();
		
		// Calculate the score
		score = calcScore((double[]) t1, ref);

		// Store the entry in the trial data
		level.addTrial((double[]) recovered, (double[]) t1,
				ref, (Double) score, comps, pcts, trialNum);
	}

	/**
	 * Calculates the score for a given trial. This might be a temporary method
	 * to be eliminated once the matlab models are used to generate a score.
	 * TODO: have the matlab models calculate the score.
	 * 
	 * @param the y plot of the distillation curve
	 * @param the y plot of the gasoline reference curve
	 * @return the score of the curve compared to gasoline
	 * 
	 */
	private Double calcScore(double[] sim, double[] gas) {

		// Find the sum of the differences in curves
		double sum = 0;
		for (int i = 0; i < sim.length; i++) sum += Math.abs(sim[i] - gas[i]);
		
		// Calculate the score based on the average difference in curves
		double avg = sum / (double) sim.length;
		double score = 100.0 - avg;
		
		// If the score is so bad that it's negative, just return 0
		if (score < 0) score = 0;

		return score;
	}

	/**
	 * Accessor for the game's current level.
	 * 
	 * @return the level of the game
	 * 
	 */
	public Level getLevel() {

		return level;
	}

	/**
	 * Accessor for the game's end status.
	 * 
	 * @return the level of the game
	 * 
	 */
	public boolean isOver() {

		return this.isOver;
	}

	/**
	 * Advances the current level of the game to the next level.
	 * 
	 * @return the level of the game
	 * 
	 */
	public void advanceLevel() {

		// If there are no more levels, end the game
		if (level.getNumber() + 1 > LAST_LEVEL) endGame();

		// Otherwise advance to the next level
		else {

			// Create the new level
			level = new Level(new LevelData(level.getNumber() + 1));

			// Initialize the new level
			initLevel();
		}
	}

	/**
	 * Ends the game.
	 * 
	 */
	private void endGame() {

		this.isOver = true;
	}
	
	/**
	 * Kills all of the game's resources.
	 * 
	 */
	public void destroy() {

		// Exit the matlab session
		this.mat.exit();
	}
}
