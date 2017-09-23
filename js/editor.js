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
				$('#markupRow').append("<div class='editorHolder newEditor col-xs-1'" + _a.editor.column.width + "'></div>");
				//Find the just added editor and remove the class that designates it as a just added editor
				var newEditor = $('.newEditor').hide();
				newEditor.addClass('markupEditor');
				newEditor.html(htmlContent).removeClass('newEditor');
				
				//Activate newly added script. This is a bit of a hack :)
				eval($('#loadScript').html());
				//remove the initscript after it has been run once
				$('#loadScript').remove();

				//Resizes the columns
				alexander.editor.column.resize();

				//FadeIn 400ms after we're showing, to allow for the space to be there (300ms)
				setTimeout(function(){
					newEditor.fadeIn(200);
					newEditor.addClass('animated slideInRight');
					alexander.editor.column.resize();
				}, 300);
			},

			/**
			 * Removes the column with the specified ID
			 */
			remove: function(id){
				$('#holder_' + id).parent().fadeOut(400, function(){
					this.remove()
					alexander.editor.column.resize();
				});
			},

			/**
			 * Recalculates the width class necessary to display the columns next to each other
			 */
			resize: function(){
				//Get the new width of the columns
				var newWidth = alexander.editor.column.widthClasses[Math.max(0, Math.min($('.editorHolder').length, 3)) - 1];
				//Remove all the width classes and add the new one
				$('.editorHolder').removeClass('col-xs-12 col-xs-6 col-xs-4 col-xs-3 col-xs-1').addClass('col-xs-' + newWidth);
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