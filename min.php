<?php
/**
 * This file takes care of delivering minified versions of css and js files. This decreases
 * download size while still keeping all documents readable for editing.
 */
require_once 'classes/util/util.php';

//echo CSS minified
if(isset($_GET['css'])){
	header("Content-type: text/css");
	echo minify(file_get_contents ( 'css/' . $_GET['css'], FILE_USE_INCLUDE_PATH ));
}
//echo JS minified
if(isset($_GET['js'])){
	header("Content-type: application/javascript");
	
	//has issues with single line comments commenting out the whole file. How to remove single line comments?
	//echo minify(file_get_contents ( 'js/' . $_GET['js'], FILE_USE_INCLUDE_PATH ));
	
	//this also doesn;t work. Seems to have no effect on anything but php code
	//echo php_strip_whitespace('js/' . $_GET['js']);
	
	//only usefull alternative right now
	echo file_get_contents ( 'js/' . $_GET['js'], FILE_USE_INCLUDE_PATH );
}