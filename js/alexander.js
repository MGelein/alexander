//Global alexander variable
var alexander = {
	version: "1.0.1",
	author: "Mees Gelein"
};

//Useful to set in the console to be able to view logging of ajax messages
var AJAX_LOGGING = false;

/**
 * Anonymous namespace for this file. Will be exported to the appropriate objects.
 */
(function(_a){
	
	_a.editor = {
		/**
		 * Creates a new texteditor using the provided ID as the base area. This function
		 * creates the text editor with our own custom buttonset
		 * @param areaID
		 * @returns {nicEditor}
		 */
		new: function(areaID){
			editor = new nicEditor({buttonList : ['bold','italic','underline','strikeThrough','subscript','superscript']});
			editor.panelInstance(areaID);
			return editor;
		},

		/**
		 * Returns to the text-load page
		 */
		exitEditor: function(){
			index = window.location.href.indexOf("?");
			window.location = window.location.href.substring(0, index);
		}
	};


})(alexander);