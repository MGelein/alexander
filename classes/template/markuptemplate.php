<?php
require_once 'classes/template/template.php';

/**
 * Decides what markup template to load > loads it > populates
 * the template and then returns it to JS
 * @author Mees Gelein
 */
class MarkupTemplate extends Template{
	
	/**
	 * Sets the active page of this header
	 *
	 * @param unknown $active
	 */
	function __construct($markup) {
		parent::__construct ( 'templates/markup/' . $markup->getType() . '.html' );
		$id = $markup->getID();
		
		$data = json_decode(loadTextFile("markup/markup-$id"), true);
		
		$this->templatePopulation($markup->getType(), $data, $id);
	}
	
	/**
	 * Decides how to populate the template based on the type of markup that is requested
	 * @param unknown $markupType
	 */
	function templatePopulation($markupType, $data, $id){
		switch($markupType){
			case 'default':
			default:
				$this->defaultReplace($data, $id);
				break;
		}
	}
	
	/**
	 * Handles the default variable replacement for the provided template
	 */
	function defaultReplace($data, $id){
		$this->replaceVars ( array (
			'id' => $id,
			'content' => $data['content']
		) );
	}
}
