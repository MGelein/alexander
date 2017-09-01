<?php
/**
 * Simple Data object that will hold data for this specific markup instance
 * @author Mees Gelein
 */
class Markup{
	
	/**
	 * Creates a new markup
	 * Returns the ID of the new markup
	 */
	public static function createNew(){
		$connection = SQLConnection::getActive();
		
		if ($connection->select('id', 'markups', "WHERE status=-1 LIMIT 1")){
			if($connection->num_results() == 1) {
				$id = $connection->get_row_field();
				saveTextFile ( "markups/markup-$id", "" );
				return $id;
			}else{
				if($connection->insert('markups', 'type, status','0, -1')){
					return Markup::createNew();
				}
			}
		}else{
			return;
		}
	}
	
	/**
	 * Converts the note with the provided ID to a markup
	 * @param unknown $id
	 */
	public static function convert($id){
		$newID = Markup::createNew();
		Markup::load($newID);
		
		//creates a new standard object to load
		$markup = array();
		$markup['content'] = loadTextFile("notes/note-$id");		
		
		saveTextFile("markups/markup-$newID", serialize($markup));
		echo $newID;
	}

	/**
	 * Loads the markup specified by the ID
	 * @param unknown $id
	 */
	public static function load($id){
		$connection = SQLConnection::getActive();
		$connection->update('markups', 'status=0', "WHERE id=$id");
		
		$markupTemplate = new MarkupTemplate($id);
		
		return $markupTemplate->display();
	}
	
	/**
	 * Saves the markup with the provided ID
	 * @param unknown $id
	 */
	public static function save($id){
		$markup = array();
		
		foreach($_POST as $key => $value){
			if($key == 'saveMarkup' || $key == 'AJAX') continue;			
			$markup[$key] = $value;
		}
		
		saveTextFile("markups/markup-$id", serialize($markup));
		
		//Echo the ID back in case we want to remove the markup holder
		echo $id;
	}
}