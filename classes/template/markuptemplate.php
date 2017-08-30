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
	function __construct($id, $markupType = 'default') {
		parent::__construct ( 'templates/markups/' . $markupType . '.html' );
		
		$markup = unserialize(loadTextFile("markups/markup-$id"));
		
		$this->templatePopulation($markupType, $markup, $id);
	}
	
	/**
	 * Decides how to populate the template based on the type of markup that is requested
	 * @param unknown $markupType
	 */
	function templatePopulation($markupType, $markup, $id){
		switch($markupType){
			case 'default':
			default:
				$this->defaultReplace($markup, $id);
				break;
		}
	}
	
	/**
	 * Handles the default variable replacement for the provided template
	 */
	function defaultReplace($markup, $id){
		$this->replaceVars ( array (
				'id' => $id,
				'content' => $markup['content']
		) );
	}
}
