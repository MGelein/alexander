<?php
//Import some basic utilities
require_once 'classes/alexander.php';

//restart SESSION
restartSession();

//open DB connection
$connection = new SQLConnection();

//check for AJAX messaging
if(isset($_POST['ajaxMethod']) && isset($_SESSION['user'])){
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
	$currentUser = new User($_SESSION['user']);
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

		case 'newText':
			echo Text::createNew();
			break;

		case 'loadText':
			echo Text::load(getPost('data'));
			break;
		
		case 'saveText':
			$text = new Text($_SESSION ['textID']);
			$text->change($_POST['data']);
			echo $text->save();
			break;
		
		case 'loadTextOverview':
			echo Text::listAll();
			break;

		case 'userChangePass':
			if($currentUser->getLevel() > 0) echo "Access denied";
			echo (new User($_POST['data']['email']))->changePassword($_POST['data']['edit']);
			break;

		case 'userChangeEmail':
			if($currentUser->getLevel() > 0) echo "Access denied";
			echo (new User($_POST['data']['email']))->changeEmail($_POST['data']['edit']);
			break;
		
		case 'userChangeName':
			if($currentUser->getLevel() > 0) echo "Access denied";
			echo (new User(getPost('data')['email']))->changeName(getPost('data')['edit']);
			break;

		case 'loadUserOverview':
			echo User::listAll();
			break;
		
		case 'echo':
			echo $_POST['data'];
			break;
		
		default:
			echo "UNRECOGNIZED AJAX COMMAND! IGNORED";
			break;
	}
}