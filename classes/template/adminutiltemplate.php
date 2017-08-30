<?php
require_once 'classes/template/template.php';

/**
 * Template just for the admin utilities
 *
 * @author Mees Gelein
 */
class AdminUtilTemplate extends Template{

	/**
	 * Creates the AdminUtilTemplate
	 */
	function __construct() {
		parent::__construct ( 'templates/adminutil.tmpl' );
	}
}
