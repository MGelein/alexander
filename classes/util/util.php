<?php

/**
 * This block of code checks for magic quotes and removes them. The
 * trick is in the recursive part.
 */
function clearMagicQuotes($variable)
{
	if (is_array($variable)) {
		return array_map('clearMagicQuotes', $variable);
	} else {
		return stripslashes($variable);
	}
}

/**
 * Minifies the provided text (clears whitespace and
 * removes block comments
 * @param unknown $text
 */
function minify($text){
	//remove all tabs and newlines
	$text = str_replace ( array (
			"\n",
			"\t",
			"\r"
	), " ", $text );
	//remove all spaces
	$text = str_replace(array('  '), ' ', $text);
	//remove block comments => /** block comments **/
	//$text = preg_replace( '/\/\*\*(.|\s)*?\*\*\//' , '' , $text);
	return $text;
}

/**
 * Logs the current user out (Destroy the session)
 */
function logOut(){
	session_unset ();
	session_destroy ();
	forward('index.php');
}

/**
 * Fixes the string by stripping slashes, tags and htmlentities
 * @param unknown $string
 * @return string
 */
function fixString($string){
	return stripslashes(htmlentities(strip_tags($string)));
}

/**
 * Retrieves the provided value from the $_POST array, and sanatizes
 * it before returning
 * @param unknown $varname
 */
function getPost($varname){
	return fixString($_POST[$varname]);
}

/**
 * Checks if a session is currently running, then makes one
 * if there isn't one yet.
 */
function restartSession(){
	if(session_id() == ''){
		session_start();
	}else{
		session_regenerate_id(true);
	}
}

/**
 * Checks when this code is parsed (on include) if magic quotes are on. 
 * If so it removes them.
 */
/*
if (get_magic_quotes_gpc()) {
	$_GET = clearMagicQuotes($_GET);
	$_POST = clearMagicQuotes($_POST);
	$_COOKIES = clearMagicQuotes($_COOKIES);
}
*/