(function(_a){
    /**
	 * Select object, contains all methods to do with selection and ranges
	 */
	_a.select = {
		/**
		 * Returns the range HTML code. Quick function to make this compatible with IE (supposedly)
		 */
		getRange : function (){
		   r = null;
		   tmp = alexander.util.ce('span');
		   if (window.getSelection && window.getSelection().getRangeAt) {
			   r = window.getSelection().getRangeAt(0);
			   tmp.appendChild(r.extractContents());
			   return tmp.innerHTML;
		   }else if (document.selection && document.selection.createRange) {
			   r = document.selection.createRange();
			   tmp.appendChild(r.extractContents());
			   return tmp.innerHTML;
		   }
		   return null;
	   },

	   /**
		* Clears any remaining highlights
	 	*/
	   clear : function(){
			if (window.getSelection) {
				window.getSelection().removeAllRanges();
			} else if (document.selection) {
				document.selection.empty();
			}
	   },

	   /**
		* Replaces the current selection with the provided HTML text
		* @param html
		*/
	   replaceWithHTML: function (html) {
		   var range, html;
		   if (window.getSelection && window.getSelection().getRangeAt) {
			   range = window.getSelection().getRangeAt(0);
			   range.deleteContents();
			   var div = document.createElement("div");
			   div.innerHTML = html;
			   var frag = document.createDocumentFragment(), child;
			   while ( (child = div.firstChild) ) {
				   frag.appendChild(child);
			   }
			   range.insertNode(frag);
		   } else if (document.selection && document.selection.createRange) {
			   range = document.selection.createRange();
			   range.pasteHTML(html);
		   }
	   }
	};

})(alexander);