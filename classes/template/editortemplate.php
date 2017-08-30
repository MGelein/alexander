<?php
require_once 'classes/template/template.php';

/**
 * Template just for the Editor page.
 *
 * @author Mees Gelein
 */
class EditorTemplate extends Template{

	/**
	 * Creates the EditorTemplate
	 */
	function __construct($text) {
		parent::__construct ( 'templates/editor.tmpl' );
		$this->replaceVars(array (
			'authorList' => Author::listAll(),
			'textName' => $text->getName(),
			'author' => $text->getAuthor()->getName(),
			'title' => $text->getTitle(),
			'locusF' => $text->getLocusF(),
			'locusT' => $text->getLocusT(),
			'noteTypes' => Note::getNoteTypes(),
			'textStatusTypes' => Text::getStatusTypes($text->getStatus())
	) );
	}
}
