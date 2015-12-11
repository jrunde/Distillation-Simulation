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

	// Create the component bank
	private static final List<Component> BANK;
	static {
		ArrayList<Component> filler = new ArrayList<Component>();

		// Fill it with data
		filler.add(new Component("Isobutane", "methylpropane_2", 58.12, 262));
		filler.add(new Component("Butene", "butene", 56.11, 267));
		filler.add(new Component("Butane", "butane", 58.12, 273));
		filler.add(new Component("Isopentane", "methylbutane_2", 72.15, 301));
		//filler.add(new Component("Pentene", "pentene", 70.14, 303));
		filler.add(new Component("Pentane", "pentane", 72.15, 309));		
		filler.add(new Component("Hexene", "hexene", 84.16, 336));
		//filler.add(new Component("Methanol", "methanol", 32.04, 338));
		filler.add(new Component("Hexane", "hexane", 86.18, 342));
		filler.add(new Component("Ethanol", "ethanol", 46.07, 352));
		filler.add(new Component("Isoheptane", "methylhexane_2", 100.21, 363));
		//filler.add(new Component("Heptene", "heptene", 98.19, 367));
		filler.add(new Component("Propanol", "propanol", 60.10, 370));
		//filler.add(new Component("Heptane", "heptane", 100.21, 371));
		filler.add(new Component("Isobutanol", "isobutanol", 74.12, 381));
		//filler.add(new Component("Toluene", "toluene", 92.14, 384));
		filler.add(new Component("Butanol", "butanol", 74.12, 391));
		//filler.add(new Component("Octene", "octene", 112.24, 394));
		filler.add(new Component("Octane", "octane", 114.23, 398));
		filler.add(new Component("Pentanol", "pentanol", 88.15, 410));
		filler.add(new Component("Nonane", "nonane", 128.26, 424));
		//filler.add(new Component("Decene", "decene", 140.27, 445));
		filler.add(new Component("Decane", "decane", 142.29, 447));

		BANK = Collections.unmodifiableList(filler);
	}

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

		// Configure random number generator
		Random rand = new Random();

		// Add the component and reference data
		switch (levelNum) {

		case 1:

			// Add reference curve
			int comp1 = rand.nextInt(16);
			reference.add(BANK.get(comp1).getMatlabName());
			percentages.add(1.0);

			// Add the sample component data
			components.add(BANK.get(comp1));
			for (int i = 0; i < 4; i++) {

				int next = comp1;
				while (next == comp1) {
					next = rand.nextInt(4) + (i * 4);
				}

				components.add(BANK.get(next));
			}

			// NOTE: must be in reverse order!
			Collections.sort(components);

			break;

		case 2:

			// Choose components
			comp1 = rand.nextInt(8);
			int comp2 = rand.nextInt(8) + 8;
			if (comp1 > 4) comp2 = rand.nextInt(5) + 11;

			// Add them to reference curve
			reference.add(BANK.get(comp1).getMatlabName());
			reference.add(BANK.get(comp2).getMatlabName());

			// Choose percentages
			double a = rand.nextDouble() * .6 + .2;

			// Add them to the reference curve
			percentages.add(a);
			percentages.add(1.0 - a);

			// Add the sample component data
			components.add(BANK.get(comp1));
			components.add(BANK.get(comp2));
			for (int i = 0; i < 8; i++) {

				int next = comp1;
				while (next == comp1 || next == comp2) {
					next = rand.nextInt(2) + (i * 2);
				}

				components.add(BANK.get(next));
			}

			// NOTE: must be in reverse order!
			Collections.sort(components);

			break;

		case 3:

			// Choose components
			comp1 = rand.nextInt(4);
			comp2 = rand.nextInt(4) + 6;
			int comp3 = rand.nextInt(4) + 12;

			// Add them to the reference curve
			reference.add(BANK.get(comp1).getMatlabName());
			reference.add(BANK.get(comp2).getMatlabName());
			reference.add(BANK.get(comp3).getMatlabName());

			// Choose percentages
			a = rand.nextDouble() * 0.3 + .2;
			double b = rand.nextDouble() * 0.1 + .2;

			// Add them to the reference curve
			percentages.add(a);
			percentages.add(b);
			percentages.add(1.0 - a - b);

			// Add the sample component data
			components.add(BANK.get(comp1));
			components.add(BANK.get(comp2));
			components.add(BANK.get(comp3));
			int comp4 = comp3; // Placeholder
			while (comp4 == comp3 || comp4 == comp2 || comp4 == comp1) comp4 = rand.nextInt(16);
			for (int i = 0; i < 16; i++) {
				if (i != comp1 && i != comp2 && i != comp3 && i != comp4)
					components.add(BANK.get(i));
			}

			// NOTE: must be in reverse order!
			Collections.sort(components);

			break;

		case 4:

			// Add a reference curve (NOTE: matlab name required)
			reference.add("T_EEE");
			percentages.add(1.0);

			// Add the sample component data
			comp1 = rand.nextInt(16);
			for (int i = 0; i < 16; i++) {

				if (i != comp1) components.add(BANK.get(i));
			}

			// NOTE: must be in reverse order!
			Collections.sort(components);

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
