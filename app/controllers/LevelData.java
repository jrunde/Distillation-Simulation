package controllers;

import java.util.*;

/**
 * Represents the data for a single level of the game. That being said,
 * this class technically contains hard data for all levels of the game.
 * 
 */
public class LevelData {

	// Instantiable variables
	private ArrayList<String> reference;
	private ArrayList<Double> percentages;
	private ArrayList<Component> components;
	private int levelNum;

	/**
	 * The default constructor for the level data structure. It contains
	 * hard-coded level data and adds it to the level structure based on
	 * which level number is passed in.
	 * 
	 * @param the number of the level
	 * @throws IllegalArgumentException when level passed in exceeds
	 * 		the max levels as defined in Game
	 */
	public LevelData(int levelNum) throws IllegalArgumentException {

		// Initialize the instantiable variables
		this.levelNum = levelNum;
		this.components = new ArrayList<Component>();
		this.reference = new ArrayList<String>();
		this.percentages = new ArrayList<Double>();

		// Add the component and reference data
		// Note: this is the hard-game data
		switch (levelNum) {

		case 1:

			// Add a reference curve (matlab name required)
			reference.add("ethanol");
			percentages.add(1.0);

			// Add the sample component data (NOTE: must be in reverse order!)
			components.add(new Component("Propanol", "propanol", 60.10, 370));
			components.add(new Component("Ethanol", "ethanol", 46.07, 352));
			components.add(new Component("Butanol", "butanol", 74.12, 391));

			break;

		case 2:

			// Add a reference curve (matlab name required)
			reference.add("ethanol");
			reference.add("propanol");
			percentages.add(.5);
			percentages.add(.5);

			// Add the sample component data (NOTE: must be in reverse order!)
			components.add(new Component("Propanol", "propanol", 60.10, 370));
			components.add(new Component("Methanol", "methanol", 32.04, 338));
			components.add(new Component("Ethanol", "ethanol", 46.07, 352));
			components.add(new Component("Butanol", "butanol", 74.12, 391));

			break;

		case 3:

			// Add a reference curve (matlab name required)
			reference.add("butanol");
			reference.add("isobutanol");
			reference.add("propanol");
			percentages.add(.25);
			percentages.add(.5);
			percentages.add(.25);

			// Add the sample component data (NOTE: must be in reverse order!)
			components.add(new Component("Propanol", "propanol", 60.10, 370));
			components.add(new Component("Methanol", "methanol", 32.04, 338));
			components.add(new Component("Isobutanol", 
					"isobutanol", 74.12, 381));
			components.add(new Component("Ethanol", "ethanol", 46.07, 352));
			components.add(new Component("Butanol", "butanol", 74.12, 391));
			
			break;

		case 4:

			// Add a reference curve (matlab name required)
			reference.add("ethanol");
			reference.add("methanol");
			reference.add("propanol");
			reference.add("pentanol");
			percentages.add(.2);
			percentages.add(.3);
			percentages.add(.4);
			percentages.add(.1);

			// Add the sample component data (NOTE: must be in reverse order!)
			components.add(new Component("Propanol", "propanol", 60.10, 370));
			components.add(new Component("Pentanol", "pentanol", 88.15, 410));
			components.add(new Component("Methanol", "methanol", 32.04, 338));
			components.add(new Component("Isobutanol", 
					"isobutanol", 74.12, 381));
			components.add(new Component("Ethanol", "ethanol", 46.07, 352));
			components.add(new Component("Butanol", "butanol", 74.12, 391));
			
			break;

		case 5:

			// Add a reference curve (matlab name required)
			reference.add("T_EEE");
			percentages.add(1.0);

			// Add the sample component data (NOTE: must be in reverse order!)
			components.add(new Component("Methyl Pentanoate", 
					"methyl_pentanoate", 116.16, 399));
			components.add(new Component("Hexene", "hexene", 84.16, 336));
			components.add(new Component("Ethyl Levulinate", 
					"ethyl_levulinate", 144.17, 479));
			components.add(new Component("Butene", "butene", 56.11, 267));
			
			break;

		default:

			throw new IllegalArgumentException();
		}
	}

	/**
	 * Accessor for the reference curve.
	 * 
	 * @return list of reference curve elements
	 */
	public ArrayList<String> getReference() {

		return reference;
	}
	
	/**
	 * Accessor for the reference component percentages.
	 * 
	 * @return list of reference curve percentages
	 */
	public ArrayList<Double> getRefPercentages() {

		return percentages;
	}

	/**
	 * Accessor for the component data.
	 * 
	 * @return list of the sample components
	 */
	public ArrayList<Component> getComponents() {

		return components;
	}
	
	/**
	 * Accessor for the level number.
	 * 
	 * @return the number of the level
	 */
	public int getNum() {
		
		return levelNum;
	}
}
