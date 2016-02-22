package controllers;

import java.util.*;
import matlabcontrol.MatlabInvocationException;

/**
 * Representation of a distillation simulation game. This is the object that
 * serves as the database for a user's game, as well as controls the game flow.
 * 
 */
public class Game {

	// Instantiable variables
	private int LAST_LEVEL;
	private boolean matlabOn;
	private MatlabController mat;
	private Level level;
	private boolean isOver;
	private String id;
	private long stamp;

	/**
	 * The default constructor creates the game's first level.
	 * 
	 * @param the string ID of the game
	 */
	public Game(String ID) {

		// Initialize the instantiable variables
		LAST_LEVEL = 4;
		//mat = new MatlabController();
		matlabOn = false;
		level = new Level(new LevelData(1));
		isOver = false;
		id = ID;
		stamp = (new Date().getTime()) / 1000;

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

		// Use Matlab models
		if (matlabOn) {

			// Refactor the user input data
			String[] comps = new String[level.getReference().size()];
			Double[] pcts = new Double[level.getRefPercentages().size()];
			comps = level.getReference().toArray(comps);
			pcts = level.getRefPercentages().toArray(pcts);

			// TODO: Print the components and percentages (for testing)
			String msg = "Calculating curve:\n";
			for (int i = 0; i < pcts.length; i++) msg += "\t" + pcts[i] + "% " + comps[i];
			Application.log(msg);

			try {

				// Clear the matlab workspace
				mat.clear();

				if (level.getNumber() < 4) {

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

				else {

					// Run the script
					mat.runModels();
					t1 = mat.get(comps[0]);
					recovered = new double[] {0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,99};
				}
			} 

			catch (MatlabInvocationException e) {

				// Print a matlab exception error
				Application.log("ERROR: Matlab exception");
				return;
			}
		}

		// Use java models
		else {

			// Fill the x values
			recovered = new double[] {0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100};
			
			// Fill in the y values
			t1 = drawCurve(level.getReference(), level.getRefPercentages(), level.getComponents());
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

		// Convert percentages to decimals
		for (int i = 0; i < pcts.length; i++) {
			percentages.set(i, percentages.get(i) / 100.0);
			pcts[i] = pcts[i] / 100.0;
		}
		
		// Use Matlab models
		if (matlabOn) {
			
			// TODO: Print the components and percentages (for testing)
			String msg = "Calculating curve:\n";
			for (int i = 0; i < pcts.length; i++) msg += "\t" + (pcts[i] * 100) + "% " + comps[i];
			Application.log(msg);

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

				// Print a matlab exception error
				Application.log("ERROR: Matlab exception");
				return;
			}
		}

		// Use java models
		else {

			// Fill the x values
			recovered = new double[] {0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100};

			// Fill in the y values
			t1 = drawCurve(components, percentages, level.getComponents());
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
	 * Draws an artificial curve given the trial data. This method also has to spend time sorting the
	 * components, percentages, and boiling points beforehand.
	 * 
	 * @param the components of the mixture
	 * @param the percentages of each component
	 * @param the component info
	 * @return a curve
	 * 
	 */
	private double[] drawCurve(ArrayList<String> comps, ArrayList<Double> pcts, ArrayList<Component> info) {
		
		// Add the boiling points to an array
		ArrayList<Double> bps = new ArrayList<Double>();
		for (int c = 0; c < comps.size(); c++) {
			
			if (bps.size() >= comps.size()) break;
			for (int i = 0; i < info.size(); i++) {
				
				if (comps.get(c).equals(info.get(i).getMatlabName())) {
					bps.add((Double) info.get(i).getBoilingPoint());
				}
			}
		}
		
		// Sort boiling points
		ArrayList<Double> bpsort = new ArrayList<Double>(bps);
		bpsort.sort(null);
		
		// Fill in the curve array
		int pos = 0;
		double last = 293.0;
		double[] curve = new double[21];
		if (!bpsort.isEmpty() && bpsort.get(0) < last) last = bpsort.get(0);
		for (int i = 0; i < bpsort.size(); i++) {
			
			// Determine next boiling point to work from
			int b;
			for (b = 0; b < bps.size(); b++) {
				
				if (bpsort.get(i) == bps.get(b)) break;
			}
			
			// Draw actual curve
			int j;
			for (j = 0; j <= 5 * Math.round((double) pcts.get(b) * 20); j += 5) {

				// Case 1: on intersection
				if (j == 0) {
					curve[(pos + j) / 5] = (last + (double) bps.get(b)) / 2.0;
					last = (last + (double) bps.get(b)) / 2.0;
				}
				
				// Case 2: 5 past intersection
				else if (j == 5) {
					curve[(pos + j) / 5] = last + ((double) bps.get(b) - last) * .75;
					last = (double) bps.get(b);
				}
				
				// Case 3: 5 before intersection
				else if (5 * Math.round((double) pcts.get(b) * 20) - 5 == j && b + 1 < bps.size()) {
					double next = (double) bps.get(b + 1);
					curve[(pos + j) / 5] = (double) bps.get(b) + (next - (double) bps.get(b)) / 8.0;
				}
				
				else curve[(pos + j) / 5] = (double) bps.get(b);
			}
				
			pos += j - 5;
			
			Application.log(5 * Math.round((double) pcts.get(b) * 20) + "% " + comps.get(b) + " @ " + (double) bps.get(b));
		}
		//if (curve[20] == 0) curve[20] = curve[19];
		
		// Handle the gasoline case
		if (comps.get(0).equals("T_EEE")) {
			
			curve = new double[] {0,329.05,335.45,341.15,346.85,353.75,
					360.25,367.75,375.05,380.95,385.55,388.75,391.25,393.85,
					396.65,400.15,405.25,414.15,429.55,446.15,457.27};
		}
		
		return curve;
	}
	
	/**
	 * Calculates the score for a given trial. This might be a temporary method
	 * to be eliminated once the matlab models are used to generate a score.
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
		double score = 100.0 - (4 * avg);

		// If the score is so bad that it's negative, just return 0
		if (score < 0) score = 0;

		return score;
	}

	/**
	 * Mutator for the last level of the game.
	 * 
	 * @param the number of levels the game should have.
	 * 
	 */
	public void setLastLevel(int levels) {

		// Block bad data
		if (levels > 4) levels = 4;
		else if (levels < 1) levels = 1;

		this.LAST_LEVEL = levels;
	}

	/**
	 * Mutator for using matlab models.
	 * 
	 */
	public void turnMatlabOn() {

		if (matlabOn) return;
		mat = new MatlabController();
		this.matlabOn = true;
	}

	/**
	 * Accessor for the game's identification code.
	 * 
	 * @return the ID of the game
	 * 
	 */
	public String getID() {

		return id;
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
	 * Accessor for if the game uses matlab models.
	 * 
	 * @return if matlab is currently being used
	 * 
	 */
	public boolean isMatlabOn() {

		return this.matlabOn;
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
			level.newLevel(new LevelData(level.getNumber() + 1));

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

	/**
	 * Time-stamps the game so that the garbage collector can tell
	 * when it was last active. The idea is to know when to get rid
	 * of old game data.
	 * 
	 */
	public void stamp() {

		stamp = (new Date().getTime()) / 1000;
	}

	/**
	 * Retrieves last time-stamp.
	 * 
	 * @return the last time-stamp of the game.
	 * 
	 */
	public long getLastStamp() {

		return stamp;
	}
}
