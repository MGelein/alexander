<?php
require_once 'classes/alexander.php';

/**
 * Returns the notetype (int) for the provided noteID
 * @param unknown $id
 * @return int
 */
function getNoteType($id){
	$connection = SQLConnection::getActive();
	$query = "SELECT type FROM notes WHERE id=$id LIMIT 1";
	$result = $connection->query($query);
	$row = $result->fetch_row();
	return $row[0];
}

/**
 * Forward to a page. Defaults to the editor page (optional textID). 
 */
function forward($page = "editor.php", $id = ""){
	$forwardAddress = getForwardAddress($id, $page);
	
	//finally actually forward
	header("Location: $forwardAddress");
}

/**
 * Returns the address we want to forward to
 * @param string $id
 * @param string $page
 * @return string
 */
function getForwardAddress($id = "", $page = "editor.php"){
	//construct the request URL
	$requestURL = "/alexander/$page";
	
	//construct the forward address
	$forwardAddress = (empty($_SERVER['HTTPS'])?"http://":"https://") . (empty($_SERVER['HTTP_HOST'])?$defaultHost:$_SERVER['HTTP_HOST']) . $requestURL;
	$forwardAddress = strtok($forwardAddress, '?');
	
	//if there is actually an ID appended to the forward address
	if(strlen($id) > 0) $forwardAddress .= "?txtID=$id";
	
	//return the forwardAddress
	return $forwardAddress;
}

/**
 * Loads a text file, checks if it exists
 * @param unknown $filename
 * @return string
 */
function loadTextFile($filename){
	$filename = "$filename.txt";
	if(file_exists($filename)){
		$contents = file_get_contents($filename);
		$contents = str_replace("#@", "", $contents);
		return $contents;
	}else{//file could not be found
		forward();
		exit();
	}
}

/**
 * Saves a textfile
 * @param unknown $filename
 */
function saveTextFile($filename, $content){
	$filename = "$filename.txt";
	$content = str_replace("\\\"", "#@", $content);
	file_put_contents($filename, stripslashes($content));
}

/**
 * Registers a new authorName and returns the ID it is registered with
 * @param unknown $authorName
 * @return int
 */
function registerNewAuthor($authorName){
	//insert the new value
	$connection = SQLConnection::getActive();
	$query = "INSERT INTO authors(name) VALUES('$authorName')";
	$result = $connection->query($query);
	
	//request the ID of the newly added value
	$query = "SELECT id FROM authors WHERE name='$authorName' LIMIT 1";
	$result = $connection->query($query);
	$row = $result->fetch_row();
	return $row[0];
}

/**
 * Registers a new annotation
 * @return string
 */
function registerNewNote(){
	//insert new value
	$connection = SQLConnection::getActive();
	$query = "INSERT INTO notes(type, author, status) VALUES(0, 10, -1)";
	$result = $connection->query($query);
	
	//request the ID of the newly created value
	$query = "SELECT id FROM notes WHERE status=-1 LIMIT 1";
	$result = $connection->query($query);
	$row = $result->fetch_row();
	$noteID = $row[0];
	saveNote($noteID, "", "note");
	return 'anchor:' . $noteID;
}

/**
 * Registers a new markup
 * @return string
 */
function registerNewMarkup(){
	$connection = SQLConnection::getActive();
	//$query = "INSERT INTO markups(type, status) VALUES (0, -1)";
	//$result = $connection->query($query);
	
	//request the ID of the newly created value
	$query = "SELECT ID FROM markups WHERE status=-1 LIMIT 1";
	$result = $connection->query($query);
	$row = $result->fetch_row();
	$markupID = $row[0];
	return 'markup: ' . $markupID;
}
?>