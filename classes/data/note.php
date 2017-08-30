<?php
/**
 * Like all other data classes. Handles some data storage and easy acces. Interface
 * to the DB and some display methods (HTML)
 * @author Mees Gelein
 */
class Note {
	
	/**
	 * Returns an array of all types
	 */
	public static function allTypes(){
		return array('note', 'note-expert', 'translation', 'app-fontium', 'app-criticus');
	}
	
	/**
	 * Returns all the possible note-type options HTML tags
	 */
	public static function getNoteTypes() {
		$noteTypes = "";
		foreach (Note::allTypes() as $type ) {
			$display = ucfirst($type);
			$noteTypes .= "<option value='$type'>$display</option>";
		}
		return $noteTypes;
	}
	
}