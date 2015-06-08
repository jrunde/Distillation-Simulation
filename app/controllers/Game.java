package controllers;

/**
 * Representation of a distillation simulation game. This is the object that
 * serves as the database for a user's game, as well as controls the game flow.
 * 
 */
public class Game {

	// Instantiable variables
	private Level level;
	
	// TODO: Should there be architecture for telling when the game is finished?
	
	/**
	 * The default constructor creates the game's first level.
	 * 
	 */
	public Game() {
		
		// Initialize the instantiable variables
		level = new Level(1);
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
		
		level = new Level(level.getNumber() + 1);
	}
}
