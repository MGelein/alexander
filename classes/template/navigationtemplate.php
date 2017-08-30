<?php
require_once 'classes/template/template.php';

/**
 * Template for the navigation bar.
 * The active page is set in the constructor
 *
 * @author Mees Gelein
 */
class NavigationTemplate extends Template {

	/**
	 * Creates the NavigationTemplate using the provided active page
	 *
	 * @param unknown $active
	 */
	function __construct($active) {
		parent::__construct ( 'templates/navigation.html' );
		$this->replaceVars ( array (
				'active' => $active
		) );
	}
}
