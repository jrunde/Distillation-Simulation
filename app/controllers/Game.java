package controllers;

import java.util.ArrayList;
import matlabcontrol.MatlabInvocationException;

/**
 * Representation of a distillation simulation game. This is the object that
 * serves as the database for a user's game, as well as controls the game flow.
 * 
 */
public class Game {

	// Instantiable variables
	private MatlabController mat;
	private Level level;

	// TODO: Should there be architecture for telling when the game is finished?

	/**
	 * The default constructor creates the game's first level.
	 * 
	 */
	public Game() {

		// Initialize the instantiable variables
		mat = new MatlabController();
		level = new Level(1);

		// Initialize the new level
		initLevel();
	}

	/**
	 * Uses the matlab controller to initialize the current level by basically
	 * just loading the gasoline curve from the matlab models and storing it
	 * into the new level trial data.
	 * 
	 */
	public void initLevel() {

		Object recovered = null;
		Object tsummerd86 = null;
		Object score = 88.0; // TODO: plug this into the models

		try {

			// Clear the matlab workspace
			mat.clear();

			// Fetch the target distillation curve
			mat.loadData();
			tsummerd86 = mat.get("T_summerD86");

			// TODO: More graceful way to do this?
			// Fetch the recovered percentage spread
			double[] x = {0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65,
					70, 75, 80, 85, 90, 95, 100};
			recovered = x;
		} 

		catch (MatlabInvocationException e) {

			// On failure, print stack trace
			e.printStackTrace();
		}

		// Store the data as the zeroth trial
		level.addTrial((double[]) recovered, null, (double[]) tsummerd86,
				(Double) score, null, null, level.getTrials().size() + 1);
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
		Object tsummerd86 = null;
		Object score = 88.0; // TODO: plug this into the models
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
			tsummerd86 = mat.get("T_summerD86");
		} 

		catch (MatlabInvocationException e) {

			// On failure, print stack trace
			e.printStackTrace();
		}
		
		// Store the entry in the trial data
		level.addTrial((double[]) recovered, (double[]) t1,
				(double[]) tsummerd86, (Double) score, comps, pcts, trialNum);
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
	 * Advances the current level of the game to the next level.
	 * 
	 * @return the level of the game
	 * 
	 */
	public void advanceLevel() {

		// Create the new level
		level = new Level(level.getNumber() + 1);

		// Initialize the new level
		initLevel();
	}
}
