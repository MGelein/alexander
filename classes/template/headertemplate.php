<?php
require_once 'classes/template/template.php';

/**
 * Template just for the header of the pages.
 *
 * @author Mees Gelein
 */
class HeaderTemplate extends Template {

	/**
	 * Sets the active page of this header
	 *
	 * @param unknown $active
	 */
	function __construct($htmlTitle, $css = 'none') {
		parent::__construct ( 'templates/header.html' );
		
		if($css != 'none'){
			$css = "<link rel='stylesheet' type='text/css' href='min.php?css=$css'>";
		}else{
			$css = "";
		}
		
		$this->replaceVars ( array (
				'htmlTitle' => $htmlTitle, 'css' => $css
		) );
	}
}
