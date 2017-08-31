(function(_a){

	/**
	 * Public methods for the print functionality
	 */
	_a.print = {
		load: function(handle){
			if(handle == undefined) return;
			
			//Make the AJAX request
			alexander.ajax.req('loadMarkup', handle.innerHTML, function(responseText){
				parts = responseText.split("::");
				appendNote(parts[0], parts[1]);
				
				handle.className = "note";
				loadHandle(document.getElementsByClassName('handle')[0])
			});
		}
	}

	/**
	 * Appends the provided note
	 */
	function appendNote(id, content){
		if($(id) == null){
			var note = alexander.ce('li');
			note.id = id;
			note.innerHTML = id + ": " + content;
			$('app').appendChild(note);
		}
	}

	/**
	 * Quick alias of document.getElementByID
	 * @param id
	 * @returns
	 */
	function $(id){
		return document.getElementById(id);
	}

})(alexander);