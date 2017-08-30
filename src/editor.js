newTextEditor('editorialComments');
newTextEditor('textEditor');
loadText();

/**
 * Adds a markup around the current selection
 */
function insertMarkup(){
	range = getRange();
	replaceSelectionWithHtml("<span contenteditable='false' id='markupStart' class='handle redHandle'></span>" + range + "<span id='markupEnd' contenteditable='false' class='handle redHandle'></span>");
	requestMarkupID();
}

/**
 * Moves the specified markup to the current selection
 */
function moveMarkup(id){
	mS = $('#' + id + '_start').get(0);
	mE = $('#' + id + '_end').get(0);
	
	mS.parentNode.removeChild(mS);
	mE.parentNode.removeChild(mE);
	
	tmp = ce('p');
	tmp.appendChild(mS);
	startString = tmp.innerHTML;
	tmp.removeChild(mS);
	tmp.appendChild(mE);
	endString = tmp.innerHTML;
	
	replaceSelectionWithHtml(startString + getRange() + endString);
	mS = $('#' + id + '_start').get(0);
	mE = $('#' + id + '_end').get(0);
	activateHandle(mS);
	activateHandle(mE);
}

/**
 * Requests the server to save the text using a AJAX request.
 * If true is passed as parameter, the editor will also exit
 * and load the text-loader
 * @param
 */
function saveText(checkIn){
	//loads the variables from the HTML
	textContent = nicEditors.findEditor('textEditor').getContent();
	authorName = $('#authorField').val();
	textName = $('#textNameField').val();
	textTitle = $('#titleField').val();
	locusFrom = $('#locusFromField').val();
	locusTo = $('#locusToField').val();
	textStatus = $('#textStatusSelect').val();
	
	//replace the nbsp with a normal space to send it back and forth using the AJAX messages
	textContent = textContent.replace(/&nbsp;/g, ' ');

	//sets up the AJAX message
	msg="AJAX=" + true + "&saveTextContent=" + true + "&textContent=" + textContent +
	"&authorName=" + authorName.toLowerCase() + "&textName=" + textName + 
	"&textTitle=" + textTitle + "&locusF=" + locusFrom + "&locusT=" + locusTo +"&checkIn=" + checkIn +
	"&textStatusSelect=" + textStatus;

	//creates a new AJAX request and does setup
	req = getAjaxRequest(function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(this.responseText != null){
					if(this.responseText == "OK"){
						if(checkIn) exitEditor();
					}
					else if(this.responseText == "DB_ERR"){
						alert("A database error occured. Saving has failed. Try again later.");
					}
					else if(this.responseText == "AUTH_RES_ERR"){
						alert("A result error has occured. This authorName is not yet registered. And you don't have the necessary privileges to register a new author");
					}else{
						alert(this.responseText);
					}
				}
			}
		}
	});

	//finally sends the AJAX call
	req.send(msg);
}

/**
 * Loads the markup with the specified id
 */
function loadMarkup(id){
	//check if it is not already loaded:
	var check = $('#holder_' + id).get(0)
	if(check != undefined){
		if(check.className.indexOf('alreadyLoaded') == -1){
			check.className = check.className + " alreadyLoaded";
			setTimeout(function(){
				check.className = check.className.replaceAll('alreadyLoaded', '');
			}, 1000);
		}
		return;
	}
	
	//then load the new one
	msg="AJAX=" + true + "&loadMarkup=" + id;
	req = getAjaxRequest(function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(this.responseText != null){
					addColumn(this.responseText);
					
					activateHandles();
					
					clearSelection();
				}
			}
		}
	});

	req.send(msg);
}

/**
 * Loads a complete text into the text-editor
 */
function loadText(){
	//then load the new one
	msg="AJAX=" + true + "&loadText=" + getUrlVars()['txtID'];
	req = getAjaxRequest(function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(this.responseText != null){
					nicEditors.findEditor('textEditor').setContent(this.responseText);
					
					//activate all handles
					activateHandles();
					
					setTimeout(convertNote, 1000);
				}
			}
		}
	});

	req.send(msg);
}

/**
 * Converts a single note (the first note that can be found)
 */
function convertNote(){
	note = document.getElementsByClassName('annotation')[0];
	if(note == null) return;
	className = "handle ";
	
	if(note.src.endsWith('critBut.png')){
		className += "blueHandle";
	}else if(note.src.endsWith('transBut.png')){
		className += "redHandle";
	}else if(note.src.endsWith('fontBut.png')){
		className += "greenHandle";
	}else if(note.src.endsWith('noteBut.png')){
		className += "yellowHandle";
	}
	
	mS = ce('span');
	mS.setAttribute('contenteditable', false);
	mS.className = className;
	activateHandle(mS);
	
	mE = ce('span');
	mE.setAttribute('contenteditable', false);
	mE.className = className;
	activateHandle(mE);
	
	note.parentNode.insertBefore(mE, note.nextSibling);
	note.parentNode.replaceChild(mS, note);
	
	msg = "AJAX=" + true + "&convertNote=" + note.id;
	
	req = getAjaxRequest(function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(this.responseText != null){
					id = this.responseText;
					mS.id = id + '_start';
					mE.id = id + '_end';
					mS.title = mS.innerHTML = id;
					mE.title = mE.innerHTML = id;
					
					convertNote();									
				}
			}
		}
	});

	req.send(msg);
}


/**
 * Requests a new markup ID number to use from the server.
 */
function requestMarkupID(){
	msg = "AJAX=" + true + "&requestMarkupID=" + true;
	
	req = getAjaxRequest(function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(this.responseText != null){
					
					objS = $('#markupStart').get(0);
					objE = $('#markupEnd').get(0);
					
					objS.id = this.responseText + '_start';
					objE.id = this.responseText + '_end';
					
					
					objS.innerHTML = objE.innerHTML = this.responseText;			
					objS.title = objE.title = this.responseText;
					
					activateHandle(objS);
					activateHandle(objE);
					
					loadMarkup(this.responseText);	
				}
			}
		}
	});
	
	req.send(msg);
}

/**
 * Highlights the start and end of this markup. Only fades out
 * if this is not the currently loaded markup
 */
function highlightMarkup(markupID, doHighlight, showWindow){
	if(markupID == -1) return;
	if(showWindow == undefined) showWindow = false;
	
	start = $("#" + markupID + "_start").get(0);
	end = $("#" + markupID + "_end").get(0);
	
	if(start && end){
				
		if(doHighlight){
			
			var check = $('#holder_' + markupID).get(0)
			if(check != undefined && showWindow){
				if(check.className.indexOf('highlightMarkup') == -1){
					check.className = check.className + " highlightMarkup";
				}
			}
			
			start.className = start.className + " handleSelected";
			end.className = end.className + " handleSelected";
		}else{
			var check = $('#holder_' + markupID).get(0)
			if(check != undefined){
				check.className = check.className.replaceAll('highlightMarkup', '');
			}
			start.className = start.className.replaceAll("handleSelected", "");
			end.className = end.className.replaceAll("handleSelected", "");
		}
	}
}

/**
 * Activates the provided elements with a handle class
 * @param handles
 */
function activateHandles(){
	handles = document.getElementsByClassName('handle');
	
	var i, max = handles.length;
	for(i = 0; i < max; i++){
		activateHandle(handles[i]);
	}
}
/**
 * Activates all mouse listeners of the provided handle element
 * @param handle
 */
function activateHandle(handle){
	handle.className = handle.className.replaceAll('handleSelected', '');
	
	handle.onmousedown = function(){
		loadedMarkup = this;
		loadMarkup(this.innerHTML);
	}	
	
	handle.onmouseover = function(){
		highlightMarkup(this.title, true, true);
	}
	
	handle.onmouseout = function(){
		highlightMarkup(this.title, false);
	}
}

/**
 * Replaces the current selection with the provided HTML text
 * @param html
 */
function replaceSelectionWithHtml(html) {
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

/**
 * Removes the column with the specified ID
 * @param id
 */
function removeColumn(id){
	var colToRemove = $('#holder_' + id).get(0);
	if(colToRemove != undefined){
		colToRemove.parentNode.parentNode.removeChild(colToRemove.parentNode);
	}else{
		return;
	}
	
	editorPanes = document.getElementsByClassName('editorHolder');
	prevWidth = 12;
	colWidth = 12;
	
	if(editorPanes.length > 3){
		prevWidth = 3;
		colWidth = 3;
	}else if(editorPanes.length == 3){
		prevWidth = 3;
		colWidth = 4;
	}
	else if (editorPanes.length == 2){
		prevWidth = 4;
		colWidth = 6;
	}
	else if (editorPanes.length == 1){
		prevWidth = 6;
		colWidth = 12;
	}
	
	i = 0; max = editorPanes.length;
	for(i = 0; i < max; i++){
		editorPanes[i].className = editorPanes[i].className.replace('col-sm-' + prevWidth, 'col-sm-' + colWidth);
	}
	
}

/**
 * Adds a new column div
 */
function addColumn(response){
	editorPanes = document.getElementsByClassName('editorHolder');
	prevWidth = 12;
	colWidth = 12;
	
	if(editorPanes.length > 3){
		prevWidth = 3;
		colWidth = 3;
	}else if(editorPanes.length == 3){
		prevWidth = 4;
		colWidth = 3;
	}
	else if (editorPanes.length == 2){
		prevWidth = 6;
		colWidth = 4;
	}
	else if (editorPanes.length == 1){
		prevWidth = 12;
		colWidth = 6;
	}
	
	i = 0; max = editorPanes.length;
	for(i = 0; i < max; i++){
		editorPanes[i].className = editorPanes[i].className.replace('col-sm-' + prevWidth, 'col-sm-' + colWidth);
	}
	
	resizeEditors();
	
	col = ce('div');
	col.className = "col-sm-" + colWidth  +" editorHolder";
	col.innerHTML = response;

	var editorRow = $('#markupRow').get(0);
	editorRow.appendChild(col);
	
	//Activate newly added script. This is a bit of a hack :)
	addedScript = $('#loadScript').get(0);
	eval(addedScript.innerHTML);
	//remove the initscript after it has been run once
	addedScript.parentNode.removeChild(addedScript);
}

/**
 * Resizes the nicEditors
 */
function resizeEditors(){
	$('.nicEdit-panelContain').parent().width('100%');
	$('.nicEdit-panelContain').parent().next().width('100%');
	$('.nicEdit-panelContain').width('100%');
	$('.nicEdit-panelContain').next().width('100%');
}