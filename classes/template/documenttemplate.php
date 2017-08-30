<?php
require_once 'classes/template/template.php';

/**
 * Template just for the documents page.
 *
 * @author Mees Gelein
 */
class DocumentTemplate extends Template{

	/**
	 * Creates the DocumentTemplate
	 */
	function __construct($editorFiles, $sourceFiles, $editorUploadInfo, $sourceUploadInfo) {
		parent::__construct ( 'templates/documents.html' );
		$this->replaceVars(array('editorDocs' => $editorFiles, 'sourceDocs' => $sourceFiles,
				'editorUploadInfo' => $editorUploadInfo, 'sourceUploadInfo' => $sourceUploadInfo));
	}
}
