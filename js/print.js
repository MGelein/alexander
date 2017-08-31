loadHandle(document.getElementsByClassName('handle')[0]);

/**
 * Loads the specified handle
 * @param handle
 */
function loadHandle(handle){
	if(handle == undefined) return;
	
	//Make the AJAX request
	ajaxReq('loadMarkup', handle.innerHTML, function(responseText){
		parts = this.responseText.split("::");
		appendNote(parts[0], parts[1]);
		
		handle.className = "note";
		loadHandle(document.getElementsByClassName('handle')[0])
	});
}

/**
 * Appends the provided note
 */
function appendNote(id, content){
	if($(id) == null){
		var note = ce('li');
		note.id = id;
		note.innerHTML = id + ": " + content;
		$('app').appendChild(note);
	}
}

/**
 * Quick alies of document.getElementByID
 * @param id
 * @returns
 */
function $(id){
	return document.getElementById(id);
}