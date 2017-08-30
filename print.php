<?php
require_once 'classes/alexander.php';


if(isset($_GET['fid'])){
	//loading the text from disk
	$fileID = $_GET['fid'];
	$textData = new Text($fileID);
	$text = Text::load($fileID);
	
	//displaying the template
	$printTemplate = new Template('templates/print.tmpl');
	$printTemplate->replaceVars(array(
			'htmlTitle' => $textData->generateTextHeader(),
			'text' => $text,
			'textHeader' => $textData->generateTextHeader()
	));
	echo $printTemplate->display();
}