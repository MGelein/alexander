<?php
//Import some basic utilities
require_once 'classes/alexander.php';

//restart SESSION
restartSession();

//open DB connection
$connection = new SQLConnection();

//check for AJAX messaging
if(isset($_POST['AJAX'])){
	readAjaxMessage();
}else{
	die();
}

/**
 * FUNCTIONS
 */

/**
 * Checks and handles AJAX messages
 */
function readAjaxMessage() {
	
	if(isset($_POST['requestMarkupID'])){
		echo Markup::createNew();
	}
	
	else if (isset ( $_POST ['saveMarkup'] )) {
		echo Markup::save($_POST['saveMarkup']);
	}
	
	else if (isset ( $_POST ['loadMarkup'] )) {
		echo Markup::load($_POST['loadMarkup']);
	}
	
	else if (isset ( $_POST ['convertNote'])){
		echo Markup::convert($_POST['convertNote']);
	}
	
	else if (isset ( $_POST ['newText'] )) {
		echo Text::createNew();
	} 
	
	else if (isset ( $_POST ['loadText'] )) {
		echo Text::load($_POST['loadText']);
	} 
	
	else if (isset ( $_POST ['saveTextContent'] ) && isset ( $_POST ['textContent'] ) && isset ( $_POST ['textName'] ) && isset ( $_POST ['authorName'] )) {
		echo saveTextContent ();
	}
	
	else if (isset ( $_POST ['loadTextOverview'])) {
		echo Text::listAll($_POST ['loadTextOverview'], $_POST['textFilter']);
	}
	
	else {
		echo "UNRECOGNIZED AJAX COMMAND! IGNORED";
	}
}


/**
 * Saves the current open text
 */
function saveTextContent() {
	// save the text
	$textContent = $_POST ['textContent'];
	$textID = $_SESSION ['textID'];
	$textName = getPost ( 'textName' );
	$authorName = getPost ( 'authorName' );
	$textTitle = getPost ( 'textTitle' );
	$locusF = getPost ( 'locusF' );
	$locusT = getPost ( 'locusT' );
	$checkIn = (getPost ( 'checkIn' ) == 'true');

	// finally saves the text
	return saveText ( $textID, $textContent, $authorName, $textName, $textTitle, $locusF, $locusT, $checkIn );
}

/**
 * Saves the text with the provided ID to disk.
 *
 * @param unknown $id
 */
function saveText($id, $content, $author, $textName, $textTitle, $locusF, $locusT, $checkIn) {
	// save the necessary SQL data
	$connection = SQLConnection::getActive();

	// find the author ID for the specified author
	$query = "SELECT id FROM authors WHERE name='$author' LIMIT 1";
	$result = $connection->query ( $query );

	// response handling
	if (! $result)
		return "DB_ERR"; // apparently we don;t have a DB connection?

		if ($result->num_rows < 1) { // this author is not currently registered.
			if (getUserLevel ( $_SESSION ['user'] ) <= 2) { // this user is allowed to make new names
				$authorID = registerNewAuthor ( $author );
			} else { // this user is not allowed to make new names. Warn them
				return "AUTH_RES_ERR";
			}
		} else {
			$row = $result->fetch_row();
			$authorID = $row [0];
		}

		// update the text status
		$newStatus = $_POST['textStatusSelect'];

		// only update status if the status is not 99
		$query = "SELECT status FROM texts WHERE id='$id' LIMIT 1";
		$row = $connection->query ( $query )->fetch_row ();
		$status = $row [0];

		if (!$checkIn)
			$newStatus = $status;

			// update the text database
			$query = "UPDATE texts SET name='$textName', status='$newStatus',author='$authorID', title='$textTitle', locusF='$locusF', locusT='$locusT' WHERE id='$id'";
			$connection->query ( $query );

			// save the text content to disk
			saveTextFile ( "texts/txt-$id", $content );

			// all is well. Communicate to javascript
			return "OK";
}
