<?php
require_once 'classes/template/template.php';

/**
 * Template just for a text item. Tiny snippet
 * @author Mees Gelein
 */
class TextItemTemplate extends Template{

	/**
	 * Creates the TextItemTemplate
	 */
	function __construct() {
		parent::__construct ( 'templates/textitem.tmpl' );
	}
	
	/**
	 * Replaces the provided variables and displays the template
	 * @param unknown $id
	 * @param unknown $labelType
	 * @param unknown $name
	 * @param unknown $author
	 * @param unknown $title
	 * @return mixed|string
	 */
	function renderOnce($id, $labelType, $name, $author, $title){
		if (strlen ( $name ) > 8)
			$name = substr ( $name, 0, 8 ) . ".";
		
		if (strlen ( $author ) > 15)
			$author = substr ( $author, 0, 14 ) . ".";
		
		//handle text titles (restrict their length)
		if (strlen ( $title ) > 20)
			$textTitle = substr ( $title, 0, 20 ) . ".";
		
		$this->replaceVars(array('id' => $id, 'labelType' => $labelType,
				'name' => ucwords($name), 'author' => ucwords($author), 'title' => $title));
		return $this->display();
	}
}
