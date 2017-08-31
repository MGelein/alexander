<?php
//Import some basic utilities
require_once 'classes/alexander.php';

//restart SESSION
restartSession();

//open DB connection
$connection = new SQLConnection();

//check for AJAX messaging
if(isset($_POST['ajaxMethod'])){
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
	switch($_POST['ajaxMethod']){
		case 'requestMarkupID':
			echo Markup::createNew();
			break;

		case 'saveMarkup':
			echo Markup::save($_POST['data']);
			break;

		case 'loadMarkup':
			echo Markup::load($_POST['data']);
			break;

		case 'convertNote':
			echo Markup::convert($_POST['data']);
			break;

		case 'newText':
			echo Text::createNew();
			break;

		case 'loadText':
			echo Text::load($_POST['data']);
			break;
		
		case 'saveText':
			echo saveTextContent($_POST['data']);
			break;
		
		case 'loadTextOverview':
			echo Text::listAll();
			break;
		
		case 'echo':
			echo $_POST['data'];
			break;
		
		default:
			echo "UNRECOGNIZED AJAX COMMAND! IGNORED";
			break;
	}
}


/**
 * Saves the current open text
 */
function saveTextContent($data) {
	// save the text
	$textContent = $data['textContent'];
	$textID = $_SESSION ['textID'];
	$textName = $data['textName'];
	$authorName = $data['authorName'];
	$textTitle = $data['textTitle'];
	$locusF = $data['locusF'];
	$locusT = $data['locusT'];
	$checkIn = ($data['checkIn'] == 'true');

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
