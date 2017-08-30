<?php
/**
 * A class that can load HTML templates and
 * has the necessary functions to replace variables
 * @author Mees Gelein
 */
class Template {
	
	/**
	 * The file that will hold the template
	 */
	private $templateFile;
	
	/**
	 * The changed file, this will hold the variabled substituted output
	 */
	private $outputFile;
	
	/**
	 * Creates a new template using the provided file url.
	 * Loads the template
	 * 
	 * @param unknown $fileName        	
	 */
	function __construct($fileName) {
		$this->templateFile = file_get_contents ( $fileName, FILE_USE_INCLUDE_PATH );
		$this->outputFile = $this->templateFile;
	}
	
	/**
	 * Replaces the list of variables (key-value)(varName-var) in the
	 * templatefile
	 * 
	 * @param unknown $varArray        	
	 */
	function replaceVars($varArray) {
		$this->outputFile = $this->templateFile;
		foreach ( $varArray as $varName => $var )
			$this->outputFile = str_replace ( '{' . $varName . '}', $var, $this->outputFile );
	}
	
	/**
	 * Echoes the contents of the templatefile.
	 * You should replaceAll vars before
	 * you display the contents of a file! Also removes all newlines, carriage returns and tabs from the output
	 */
	function display() {
		//remove all tabs and newlines
		$this->outputFile = str_replace ( array (
				"\n",
				"\t",
				"\r" 
		), "", $this->outputFile );
		//remove all spaces
		$this->outputFile = str_replace(array('  '), ' ', $this->outputFile);
		//remove all comments
		$this->outputFile = preg_replace( '/<!--(.|\s)*?-->/' , '' , $this->outputFile);
		return $this->outputFile;
	}
}
?>