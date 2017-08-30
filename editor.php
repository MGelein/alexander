<?php
require_once 'classes/alexander.php';

// start session
restartSession ();

// variables we need on this page
$editMode = false;

// check if we are logged in
if (! isset ( $_SESSION ['user'] )) { // if we are not logged in forward to index.php
	forward ('index.php');
}

// we check if we are loading a text using a GET variable
if (isset ( $_GET ['txtID'] )) {
	$textID = htmlentities ( $_GET ['txtID'] );
	$text = new Text($textID);
	
	//load the text and set this page to editmode (vs loader mode)
	$editMode = true;
	$_SESSION ['textID'] = $textID;
}



// loading content based on editmode or not
$contentTemplate;
$pageTitle = 'Loader';
$pageCSS = 'none';
if ($editMode) {
	$pageTitle = 'Editor';
	$pageCSS = 'editor.css';
	$contentTemplate = new EditorTemplate($text);
} else {
	$contentTemplate = new Template ( 'templates/loader.tmpl' );
}

// rendering the header
$headerTemplate = new HeaderTemplate($pageTitle, $pageCSS);
echo $headerTemplate->display();
// show navigation bar with the provided active tab
$navigationTemplate = new NavigationTemplate('editor');
echo $navigationTemplate->display();

//display the content
echo $contentTemplate->display();
die();

// rendering the footer
$footerTemplate = new FooterTemplate();
echo $footerTemplate->display();
exit ();
