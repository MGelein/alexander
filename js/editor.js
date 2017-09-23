/**
 * Namespace for the editor methods
 */
(function(_a){
	/**
	 * All the methods corresponding to the editor UI
	 */
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
		exit: function(){
			index = window.location.href.indexOf("?");
			window.location = window.location.href.substring(0, index);
		}
	};
})(alexander);