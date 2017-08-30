<?php
require_once 'classes/template/template.php';

/**
 * Template just for the header of the pages.
 *
 * @author Mees Gelein
 */
class FooterTemplate extends Template {

	/**
	 * Creates the FooterTemplate
	 *
	 * @param unknown $active
	 */
	function __construct() {
		parent::__construct ( 'templates/footer.tmpl' );
	}
}

