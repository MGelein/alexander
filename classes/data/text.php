<?php
/**
 * Simple data object that will hold the text data.
 * I.e: Author, status, id, etc.
 */
class Text{
	
	/**
	 * Lists all the types of status for text in HTML option tags
	 * @param unknown $selected
	 */
	public static function getStatusTypes($selected){
		$statusTypes = "";
		$types = array(	99 => 'Yellow (Forbidden)',
						-1 => 'Red (Checked out)', 
						0 => 'Blue (Admin)',
						1 => 'Grey (Master)',
						2 => 'Light Blue (Teacher)',
						3 => 'Green (Student)');
		foreach($types as $type => $name){
			if($type == $selected){
				$statusTypes .= "<option selected value='$type'>" . $name .  "</option>";
			}else{
				$statusTypes .= "<option  value='$type'>" . $name .  "</option>";
			}
		}
	
		return $statusTypes;
	}
	/**
	 * Generates the text overview used in the loader. Just returns all the texts
	 * in a HTML string. Filtering and ordering of texts is done clientside
	 * @return string
	 */
	public static function listAll(){
		$textOverview = '';
		
		$connection = SQLConnection::getActive();
		$query = "SELECT texts.id, texts.name, authors.name, texts.status, texts.title FROM texts INNER JOIN authors ON texts.author=authors.id";// ORDER BY $textOrder";
		$result = $connection->query ( $query );
		$labelType = "label-default";
		$textItemTemplate = new TextItemTemplate();
		if (! $result)
			die ( $db_result_error );
		while ( $row = $result->fetch_row() ) {
			switch ($row [3]) { // change label type based on status
				case - 2 :
					$labelType = "label-danger";
					break;
				case - 1 :
					$labelType = "label-danger";
					break;
				case 0 :
					$labelType = "label-primary";
					break;
				case 1 :
					$labelType = "label-default";
					break;
				case 2 :
					$labelType = "label-info";
					break;
				case 3 :
					$labelType = "label-success";
					break;
				case 99 :
					$labelType = "label-warning";
					break;
			}
			
			$textItemString = $textItemTemplate->renderOnce( $row [0], $labelType, $row [1], $row [2], $row [4] );
			$textOverview .= $textItemString;
		}
		return $textOverview;
	}
	

	/**
	 * Creates a new text and forwards the user to that page
	 */
	public static function createNew() {
		// check if we have an empty text in the database
		$connection = SQLConnection::getActive();
		$query = "SELECT id FROM texts WHERE status=-1 LIMIT 1";
		$result = $connection->query ( $query );
	
		if ($result->num_rows < 1) { // there is no empty text, so just create a new one and run this function again
			$query = "INSERT INTO texts(name, author, status, title) VALUES('NewTxt', 10, -1, 'NewTitle')";
			$connection->query ( $query );
			return Text::createNew ();
		} else {
			$row = $result->fetch_row();
			$id = $row [0]; // return the id of the empty text
			saveTextFile ( "texts/txt-$id", "" );
			return getForwardAddress($id);
		}
	}
	
	
	/**
	 * Loads the text with the provided ID from disk
	 * @param unknown $id
	 */
	public static function load($id) {
		return loadTextFile ( "texts/txt-$id" );
	}
	
	/**The unique identifier number of this text*/
	private $id = -1;
	/**The name of this text*/
	private $name = '';
	/**The author identifier of this text*/
	private $author = '';
	/**The title of this text*/
	private $title = '';
	/**The starting location of this fragment*/
	private $locusF = '';
	/**The ending location of this fragment*/
	private $locusT = '';
	/**The editorial status number of this text*/
	private $status = 404;
	/**The content of the file that is linked to the DB*/
	private $content;
	
	/**
	 * Loads the text using its ID number
	 * @param unknown $id
	 */
	function __construct($id){
		$this->id = $id;
		
		//try to load it from the DB
		$connection = SQLConnection::getActive();
		$result = $connection->select('name, author, title, locusF, locusT, status', 'texts', "WHERE id=$id LIMIT 1");
		if ($result){
			if($result->num_rows < 1) return;
			$row = $result->fetch_assoc();
		}else{
			return;
		}
		
		//populate the data object
		$this->name = $row['name'];
		$this->author = new Author($row['author']);
		$this->title = $row['title'];
		$this->locusF = $row['locusF'];
		$this->locusT = $row['locusT'];
		$this->status = $row['status'];
		$this->content = Text::load($id);
	}

	/**
	 * Changes the text with the changes described in the data object
	 */
	function change($data){
		$this->content = $data['textContent'];
		$this->name = $data['textName'];
		$this->author = $data['authorName'];
		$this->title = $data['textTitle'];
		$this->locusF = $data['locusF'];
		$this->locusT = $data['locusT'];
		$this->status = $data['textStatusSelect'];
	}

	/**
	 * Saves the changes to disk.
	 */
	function save(){
		//get a DB connection
		$connection = SQLConnection::getActive();
		//find the authorID for the specified author
		$authorID = Author::getIDFromName($this->author);
		//Update the DB
		$query = "UPDATE texts SET name='$this->name', status='$this->status',author='$authorID', title='$this->title', locusF='$this->locusF', locusT='$this->locusT' WHERE id='$this->id'";
		$connection->query($query);
		//Update the content file
		saveTextFile("texts/txt-$this->id", $this->content);
		//All is well, communicate to JS
		return "OK";
	}
	
	/**
	 * Returns the ID number of this text
	 * @return unknown
	 */
	function getID(){
		return $this->id;
	}
	
	/**
	 * Returns the name of this text
	 */
	function getName(){
		return $this->name;
	}
	
	/**
	 * Returns the author ID of this text
	 * @return Author
	 */
	function getAuthor(){
		return $this->author;
	}
	
	/**
	 * Returns the title of this text
	 */
	function getTitle(){
		return $this->title;
	}
	
	/**
	 * Returns the start location of this fragment
	 */
	function getLocusF(){
		return $this->locusF;
	}
	
	/**
	 * Returns the end location of this fragment
	 */
	function getLocusT(){
		return $this->locusT;
	}
	
	/**
	 * Returns the status number of this text (ie: -1 = checked out?)
	 */
	function getStatus(){
		return $this->status;
	}
	
	/**
	 * Returns a print header. Only used for the print edition
	 */
	function generateTextHeader(){
		$textLocus = "(" . $this->getLocusF() . " - " . $this->getLocusT() . ")";
		return "Alexander: " . $this->getName() . " : " . $this->getTitle() . " $textLocus by " . $this->getAuthor()->getName();
	}
}