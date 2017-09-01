/**
 * Namespace for the editor methods
 */
(function(_a){
	/**
	 * All the methods corresponding to the editor UI
	 */
	_a.editor = {
		/**
		 * All methods for working with columns of the markupEditors
		 */
		column : {
			/**
			 * Current width class used for the markupEditors. Starts at 12 > 6 > 4 > 3 (min)
			 */
			width: 12,

			/**
			 * All possible width classes in order
			 */
			widthClasses: [12, 6, 4, 3],

			/**
			 * Adds a new column using the provided HTMLcontent as the content
			 * of the new column
			 */
			add: function(htmlContent){
				$('#markupRow').append("<div class='editorHolder newEditor col-sm-'" + _a.editor.column.width + "'></div>");
				//Find the just added editor and remove the class that designates it as a just added editor
				$('.newEditor').html(htmlContent).removeClass('newEditor');
				
				//Activate newly added script. This is a bit of a hack :)
				eval($('#loadScript').html());
				//remove the initscript after it has been run once
				$('#loadScript').remove();

				//Resizes the columns
				alexander.editor.column.resize();
			},

			/**
			 * Removes the column with the specified ID
			 */
			remove: function(id){
				$('#holder_' + id).parent().remove();
				alexander.editor.column.resize();
			},

			/**
			 * Recalculates the width class necessary to display the columns next to each other
			 */
			resize: function(){
				//Get the new width of the columns
				var newWidth = widthClasses[Math.max(0, Math.min($('.editorHolder').length - 1, 3))];
				//Remove the old width class and add the new width class
				$('.col-sm-' + width).removeClass('col-sm-' + _a.editor.column.width).addClass('col-sm-' + newWidth);
				//Reassign the currentWidth class
				_a.editor.column.width = newWidth;

				//Quickly also resize all nicEditor panels, this is a bit of a hack, should be improved!
				$('.nicEdit-panelContain').parent().width('100%');
				$('.nicEdit-panelContain').parent().next().width('100%');
				$('.nicEdit-panelContain').width('100%');
				$('.nicEdit-panelContain').next().width('100%');
			}
		},

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
		}
	};
})(alexander);