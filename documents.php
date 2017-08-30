<?php
// necessary imports
require_once 'classes/alexander.php';

// start session
restartSession ();

// establish DB connection
$connection = new SQLConnection ();

// render the header
$headerTemplate = new HeaderTemplate('Documents');
echo $headerTemplate->display();

// check if we're logged in
if (! isset ( $_SESSION ['user'] )) {
	forward ('index.php');
} else {
	
	// initiliaze the needed variables
	$editorUploadInfo = $sourceUploadInfo = "";
	
	// check if we're uploading files
	if (isset ( $_FILES ['sourceFileUpload'] )) {
		$sourceUploadInfo = saveUploadedFile ( 'sourceFileUpload', 'sourcedocs' );
	} else if (isset ( $_FILES ['editorFileUpload'] )) {
		$editorUploadInfo = saveUploadedFile ( 'editorFileUpload', 'editordocs' );
	}
	
	// show navigation bar with the provided active tab
	$navigationTemplate = new NavigationTemplate ( 'documents' );
	echo $navigationTemplate->display();
	
	// scan the editor documents folder for files
	$deleteColumn = "";
	$user = new User($_SESSION['user']);
	if($user->getLevel() < 1){
		$deleteColumn = "<th></th>";
	}
	$editorDocs = "<table class='table table-striped table-condensed table-bordered'>";
	$editorDocs .= "<tr><th>Filename</th><th>Last Modified</th>$deleteColumn</tr>";
	$files = scandir ( 'documents/editordocs' );
	$max = count ( $files );
	// loop through all docs
	foreach ( $files as $file ) {
		$editorDocs .= createFileEntry ( $file, 'editordocs' );
	}
	
	// scan the source documents folder for files
	$sourceDocs = "<table class='table table-striped table-condensed table-bordered'>";
	$sourceDocs .= "<tr><th>Filename</th><th>Last Modified</th>$deleteColumn</tr>";
	$files = scandir ( 'documents/sourcedocs' );
	// loop through all the docs
	foreach ( $files as $file ) {
		$sourceDocs .= createFileEntry ( $file, 'sourcedocs' );
	}
	
	// show the documents content
	$editorDocs .= '</table>';
	$sourceDocs .= '</table>';
	
	//and display the template
	$documentTemplate = new DocumentTemplate ( $editorDocs, $sourceDocs, $editorUploadInfo, $sourceUploadInfo );
	echo $documentTemplate->display();
}

// render the footer
$footerTemplate = new FooterTemplate();
echo $footerTemplate->display();

// close the connection
$connection->close ();

/**
 * Creates a file entry for the provided filename
 *
 * @param unknown $file        	
 */
function createFileEntry($file, $folder) {
	$folder = 'documents/' . $folder;
	// if it is nothing, return nothing
	if ($file == '.' || $file == '..')
		return '';
		
		// get the last modified date
	$lastModified = date ( "F d Y H:i:s.", filemtime ( $folder . '/' . $file ) );
	
	$deleteButton = "";
	$user = new User($_SESSION['user']);
	if($user->getLevel() < 1){
		$deleteButton = "<td><a href='javascript:void(0)' class='btn btn-danger'><i class='glyphicon glyphicon-remove'></i></a></td>";
	}
	
	// return a <li> item
	return "<tr><td><a href='$folder/$file'>$file</a></td><td>$lastModified</td>$deleteButton</tr>";
}

/**
 * Handles file upload
 */
function saveUploadedFile($fileName, $folder) {
	$folder = 'documents/' . $folder;
	// get the file name of the file we're trying to save
	$file = $_FILES [$fileName] ['name'];
	$type = $_FILES [$fileName] ['type'];
	
	// check the file type
	// passable types are:
	// application/vnd.openxmlformats-officedocument.wordprocessingml.document
	// application/msword
	// application/pdf
	if ($type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or $type == 'application/msword' or $type == 'application/pdf') {
		// actually save that file
		if (move_uploaded_file ( $_FILES [$fileName] ['tmp_name'], $folder . '/' . $_FILES [$fileName] ['name'] )) {
			return "<span class='label label-succes'>File Upload Succeeded.</span>";
		} else {
			return "<span class='label label-warning'>File Upload Failed.</span>";
		}
	} else {
		return "<span class='label label-warning'>File Type Denied!</span>";
	}
}