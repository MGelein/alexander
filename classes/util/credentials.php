<?php
/**
 * Provides the script with the correct login details based on 
 * a boolean value that contains if this is a dev build.
 * @author Mees Gelein
 */

/**Change this variable based on the runtime environment*/
$debug_build = ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '172.31.203.46');

/**
 * Returns the name of the host we're running on. Is always 'localhost'.
 */
function get_db_hostname(){
	return 'localhost';
}

/**
 * Returns the database name of the database. Is always 'alexander'.
 */
function get_db_database(){
global $debug_build;
	//switch based on debug_build status
	if($debug_build){
		return 'alexander';
	}else{
		return 'deb106247_alexander';
		//return 'bdms';
	}
}

/**
 * Returns the name of the user for the database we're using.
 * Output depends on the state of the debug_build variable
 * @return string
 */
function get_db_username(){
	global $debug_build;
	//switch based on debug_build status
	if($debug_build){
		return 'trb1914';
	}else{
		return 'deb106247_trb1914';
		//return 'bdms';
	}
}

/**
 * Returns the password for the database we're using.
 * Output depends on the state of the debug_build variable
 * @return string
 */
function get_db_password(){
	global $debug_build;
	//switch based on debug_build status
	if($debug_build){
		return 'ykfhny';
	}else{
		return 'ykfhny';
		//return 'booktrade';
	}
}