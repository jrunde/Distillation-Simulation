package controllers;

/**
 * Represents a trial for a given level. Each time the user attempts to
 * approximate a distillation curve, a new trial will be created on the back
 * end to store the attempt.
 * 
 */
public class Trial {

	// Instantiable variables
	private final double[] x_axis;
	private final double[] y_axis;
	private final double[] gas;
	private final Double score;
	private final String[] comps;
	private final Double[] pcts;
	private final int num;
	
	/**
	 * The default constructor for catalogues trial data by the number
	 * given.
	 * 
	 * @param the trial data
	 * @param the number of the trial
	 * 
	 */
	public Trial(double[] x_axis, double[] y_axis, double[] gas, Double score,
			String[] comps, Double[] pcts, int num) {
		
		// Initialize Instantiable variables
		this.x_axis = x_axis;
		this.y_axis = y_axis;
		this.gas = gas;
		this.score = score;
		this.comps = comps;
		this.pcts = pcts;
		this.num = num;
	}
	
	/**
	 * Accessor for the x_axis associated with a given trial.
	 * 
	 * @return the x_axis of the trial
	 * 
	 */
	public double[] getX() {
		
		return this.x_axis;
	}
	
	/**
	 * Accessor for the y_axis associated with a given trial.
	 * 
	 * @return the y_axis of the trial
	 * 
	 */
	public double[] getY() {
		
		return this.y_axis;
	}
	
	/**
	 * Accessor for the gasoline reference associated with a given trial.
	 * 
	 * @return the gasoline reference of the trial
	 * 
	 */
	public double[] getGas() {
		
		return this.gas;
	}
	
	/**
	 * Accessor for the score associated with a given trial.
	 * 
	 * @return the score of the trial
	 * 
	 */
	public Double getScore() {
		
		return this.score;
	}
	
	/**
	 * Accessor for the components associated with a given trial.
	 * 
	 * @return the components of the trial
	 * 
	 */
	public String[] getComps() {
		
		return this.comps;
	}
	
	/**
	 * Accessor for the percentages associated with a given trial.
	 * 
	 * @return the percentages of the trial
	 * 
	 */
	public Double[] getPcts() {
		
		return this.pcts;
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
