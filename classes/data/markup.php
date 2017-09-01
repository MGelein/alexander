<?php
/**
 * Simple Data object that will hold data for this specific markup instance
 * @author Mees Gelein
 */
class Markup{

	/**The id of this markup*/
	private $id;
	/**The type (as string) of this markup*/
	private $type;
	/**The status number*/
	private $status;

	/**
	 * Constructs a new Markup object.
	 **/
	function __construct($id){
		//Question the db for the object
		$connection = SQLConnection::getActive();
		$connection->select('id, type, status', 'markups', "WHERE id=$id");
		$row = $connection->get_row();

		//Fill in the data object
		$this->id = $row['id'];
		$this->status = $row['status'];
		$this->type = $row['type'];
	}

	/**	
	 * Returns the ID of this markup
	 **/
	public function getID(){
		return $this->id;
	}

	/**	
	 * Returns the status of this markup
	 **/
	 public function getStatus(){
		return $this->status;
	}
	/**	
	 * Returns the type of this markup
	 **/
	 public function getType(){
		return $this->type;
	}

	/**
	 * Returns all the possible markup-type options HTML tags
	 */
	 public static function getTypes() {
		$typeArray = array('note', 'note-expert', 'translation', 'app-fontium', 'app-criticus');
		$noteTypes = "";
		foreach ($typeArray as $type ) {
			$display = ucfirst($type);
			$noteTypes .= "<option value='$type'>$display</option>";
		}
		return $noteTypes;
	}
	
	/**
	 * Creates a new markup
	 * Returns the ID of the new markup
	 */
	public static function createNew(){
		$connection = SQLConnection::getActive();
		
		if ($connection->select('id', 'markups', "WHERE status=-1 LIMIT 1")){
			if($connection->num_results() == 1) {
				$id = $connection->get_row_field();
				saveTextFile ( "markup/markup-$id", "" );
				return $id;
			}else{
				if($connection->insert('markups', 'type, status',"'default', -1")){
					return Markup::createNew();
				}
			}
		}else{
			return;
		}
	}

	/**
	 * Loads the markup specified by the ID
	 * @param unknown $id
	 */
	public static function load($id){
		$connection = SQLConnection::getActive();
		$connection->update('markups', 'status=0', "WHERE id=$id");
		
		$markupTemplate = new MarkupTemplate(new Markup($id));
		
		return $markupTemplate->display();
	}
	
	/**
	 * Saves the markup with the provided ID
	 * @param unknown $id
	 */
	public static function save($data){
		$id = $data['id'];
		
		//Save the serialized data
		saveTextFile("markup/markup-$id", json_encode($data));
		
		//Echo the ID back in case we want to remove the markup holder
		echo $id;
	}
}