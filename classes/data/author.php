<?php
/**
 * Very simple data object that represents an author 
 * @author Mees Gelein
 */
class Author{
	/**
	 * Generates a list of all author names and makes them fit for use for the
	 * options html tags. Returns the HTML code
	 */
	public static function listAll(){
		// reading the authorList from the DB
		$authorList = '';
		$connection = SQLConnection::getActive();
		if($connection->query ('SELECT name FROM authors')){
			$result = $connection->getResult();
			$row = $result->fetch_row();
			while ( $row != null ) {
				$author = ucfirst($row [0]);
				$authorList .= "<option value=$author>";
				$row = $result->fetch_row ();
			}
		}	
		return $authorList;
	}
	
	/**The full name of the author*/
	private $name = 'notset';
	/**The id number of the author*/
	private $id = -1;
	
	/**
	 * Generates a new Author ojbect with the specified ID
	 * @param unknown $id
	 */
	function __construct($id){
		$this->id = $id;
	}
	
	/**
	 * Returns the name of this Author. First time does a DB query, after that serves
	 * a cached copy
	 */
	function getName(){
		if($this->name == 'notset'){
			$connection = SQLConnection::getActive();
			if($connection->select('name','authors', "WHERE id=$this->id LIMIT 1")){
				if($connection->num_results() > 0){
					$this->name = ucwords($connection->get_row_field());
				}else{
					return "NotFound";
				}
			}else{
				return "ERR_DB_CONN";
			}
		}
		return $this->name;
	}
	
	
}