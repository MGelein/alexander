loadHandle(document.getElementsByClassName('handle')[0]);

/**
 * Loads the specified handle
 * @param handle
 */
function loadHandle(handle){
	if(handle == undefined) return;
		
	msg="AJAX=" + true + "&loadMarkup=" + handle.innerHTML;
	req = getAjaxRequest(function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(this.responseText != null){
					parts = this.responseText.split("::");
					appendNote(parts[0], parts[1]);
					
					handle.className = "note";
					loadHandle(document.getElementsByClassName('handle')[0])
				}
			}
		}
	});

	req.send(msg);
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