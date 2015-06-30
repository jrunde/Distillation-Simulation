package controllers;

/**
 * Represents a sample component that will be passed to the client and
 * added to the corresponding table.
 * 
 */
public class Component {

	// Instantiable variables
	private String name;
	private String matname;
	private double mass;
	private int boilpoint;
	
	/**
	 * The default constructor for the component class. It is very simple,
	 * taking in all the instantiable variables as parameters.
	 * 
	 * @param the display name for the component
	 * @param the matlab variable name for the component
	 * @param the molar mass of the component
	 * @param the boiling point of the component
	 * 
	 */
	public Component(String n, String mn, double m, int bp) {
		
		// Initialize instantiable variables
		name = n;
		matname = mn;
		mass = m;
		boilpoint = bp;
	}
	
	/**
	 * Accessor for the display name.
	 * 
	 * @return the component's display name.
	 * 
	 */
	public String getName() {
		
		return name;
	}

	/**
	 * Accessor for the matlab variable name.
	 * 
	 * @return the component's matlab name.
	 * 
	 */
	public String getMatlabName() {
		
		return matname;
	}
	
	/**
	 * Accessor for the molar mass.
	 * 
	 * @return the component's molar mass.
	 * 
	 */
	public double getMass() {
		
		return mass;
	}
	
	/**
	 * Accessor for the boiling point.
	 * 
	 * @return the component's boiling point.
	 * 
	 */
	public double getBoilingPoint() {
		
		return boilpoint;
	}
}
