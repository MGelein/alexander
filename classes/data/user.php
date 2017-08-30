<?php
/**
 * This class will be a data holder for user info
 * @author Mees Gelein
 */
class User{
	
	/**The different levels of acces people can have*/
	public static $access_levels = array('Admin', 'Master', 'Teacher', 'Student', 'Guest');
	/**The salt used to hash the passwords*/
	public static $salt = '!@#$%^&*(';
	
	/**
	 * Registers a new User in the database
	 * @param unknown $email			the email the user uses to login	
	 * @param unknown $password			the hashed password of the user
	 * @param unknown $level			the acces level of this new user
	 * @param unknown $fullName			the full name of the new user
	 */
	public static function registerNew($email, $password, $level, $fullName){
		$connection = SQLConnection::getActive();
		$connection->insert ( 'users', 'email, password, level, name', "'$email', '$password', $level, '$fullName'");
	}
	
	/**
	 * Checks to see if the provided email address has already been registered. 
	 * Returns succes
	 * @param unknown $email
	 * @return bool
	 */
	public static function exists($email){
		$connection = SQLConnection::getActive();
		if($connection->select('id', 'users', "WHERE email='$email' LIMIT 1")){
			if($connection->num_results() > 0){
				return true;
			}
		}
		return false;
	}
	
	/**The email adress of the user*/
	private $email = "";
	/**The hashes password of the user*/
	private $password = "";
	/**The access level of the user*/
	private $level = "";
	/**The id number of the user*/
	private $id = -1;
	/**The full name of the user*/
	private $name = "";
	
	/**
	 * Constructs a User Data object from the provided email (aka username)
	 * @param unknown $email
	 */
	function __construct($email){
		$this->email = $email;
		//Get MYSQL DB connection
		$connection = SQLConnection::getActive();
		
		//Query the database
		$result = $connection->select('id, password, level, name', 'users', "WHERE email='$email' LIMIT 1");
		if($result){
			if($result->num_rows < 1) return;		
			$row = $result->fetch_assoc();
		}else{
			return;
		}
		
		//populate the data object
		$this->id = $row['id'];
		$this->password = $row['password'];
		$this->level = $row['level'];
		$this->name = $row['name'];
	}
	
	/**
	 * Changes the old password to the new password. This value must already be hashed!
	 * Returns succes
	 * @param unknown $newPass
	 */
	function changePassword($newPass){
		$connection = SQLConnection::getActive();
		return $connection->query ( "UPDATE users SET password='$password' WHERE email='$email' LIMIT 1" );
	}
	
	/**
	 * Returns the name of this user
	 * @return string
	 */
	function getName(){
		return $this->name;
	}
	
	/**
	 * Returns the access level of this user
	 * @return int
	 */
	function getLevel(){
		return $this->level;
	}
	
	/**
	 * Returns the level name of this user's level
	 * @return string
	 */
	function getLevelName(){
		return User::$access_levels[$this->getLevel()];
	}
	
	/**
	 * Returns the password hash of this user
	 * @return string
	 */
	function getPassword(){
		return $this->password;
	}
	
	/**
	 * Returns the id of this user
	 * @return int
	 */
	function getID(){
		return $this->id;
	}
	
	/**
	 * Returns the email of this user
	 * @return string
	 */
	function getEmail(){
		return $this->email;
	}

	/**
	 * Logs out the current user
	 */
	static function logOut(){
		session_unset ();
		session_destroy ();
		forward('index.php');
	}
}