<?php
/**
 * This class will hold a single connection to the SQL database. You can reuse this object
 * using multiple queries.
 * @author Mees Gelein
 */
require_once 'classes/util/credentials.php';

class SQLConnection{
	
	/**The mysqli connection object. This class is merely an interface for this class*/
	private $connection;
	/**The mysqli_result object. This holds the result of a query.*/
	private $result;
	
	/**This variable holds the active instance*/
	private static $instance;
	
	/**
	 * Returns the currently active SQLconnection
	 */
	public static function getActive(){
		return SQLConnection::$instance;
	}
	
	/**
	 * Sets the currently active SQLconnection
	 * @param unknown $connection
	 */
	public static function setActive($connection){
		if(!is_null(SQLConnection::$instance)){
			SQLConnection::$instance->close();
		}
		SQLConnection::$instance = $connection;
	}
	
	/**
	 * Opens a new SQLConnection using the credentialmanager to
	 * get the login data. Uses the standard database (alexander).
	 */
	function __construct(){
		//try to create a SQL connection
		$this->connection = new mysqli(get_db_hostname(), get_db_username(), get_db_password(), get_db_database());
		
		//if it fails don't even try to load the page.
		if($this->connection->connect_error) die("Couldn't connect to the SQL database");
	}
	
	/**
	 * Queries the database using the provided query
	 * @param unknown $query
	 * @return mixed
	 */
	function query($query){
		$this->result = $this->connection->query($query);
		if($this->result){
			return $this->result;		
		}else{
			die("Couldn't connect to the SQL database (during query)");
		}
	}
	
	/**
	 * Select query on the database returning the provided fields from
	 * the providedd table with the provided condition f.e.: "WHERE bla=bla LIMIT 1"
	 * @param unknown $what
	 * @param unknown $table
	 * @param unknown $condition
	 * @return mixed
	 */
	function select($what, $table, $condition){
		return $this->query("SELECT $what FROM $table $condition");
	}
	
	/**
	 * Inserts the provided values in the provided format into the provided table
	 * @param unknown $table
	 * @param unknown $what
	 * @param unknown $values
	 * @return mixed
	 */
	function insert($table, $what, $values){
		return $this->query("INSERT INTO $table($what) VALUES($values)");
	}
	
	/**
	 * Updates the provided values in the database when the specified conditions
	 * are met.
	 * @param unknown $table
	 * @param unknown $what
	 * @param unknown $condition
	 * @return mixed
	 */
	function update($table, $what, $condition){
		return $this->query("UPDATE $table SET $what $condition");
	}
	
	/**
	 * Returns the number of rows in the last result
	 * @return int
	 */
	function num_results(){
		return $this->result->num_rows;
	}
	
	/**
	 * Returns the first row first field:
	 * $row = $result->fetch_array(MYSQL_NUM);
	 * return $row[$field_num] (defaults to 0);
	 */
	function get_row_field(){
		if($this->result){
			$row = $this->result->fetch_row();
			return $row[0];
		}else{
			return "";
		}
	}
	
	/**
	 * Returns the first row associative
	 */	
	function get_row(){
		return $this->result->fetch_assoc();
	}
	
	/**
	 * Closes this connection object
	 */
	function close(){
		$this->connection->close();
	}
	
	/**
	 * Returns the mysqli result object
	 * @return mysqli_result
	 */
	function getResult(){
		return $this->result;
	}
}

//when this document is loaded immediately create an open SQLConnection
SQLConnection::setActive(new SQLConnection());
