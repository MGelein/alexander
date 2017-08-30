/**
 * Creates an element with the specified name
 * @param name
 * @returns
 */
function ce(name){
	return document.createElement(name);
}


/**
 * String prototype overwrites. Generally bad practice.
 * @param suffix
 * @returns {Boolean}
 */
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Overrides '<' and '>' with french quotation marks. 
 * Prevents HTML compatibility issues.
 */ 
document.onkeydown = function(e){
	if(e.keyCode == 188){// <
		if(e.shiftKey){
			document.execCommand("insertHTML", false, "‹");
			return false;
		}
	}else if(e.keyCode == 190){// >
		if(e.shiftKey){
			document.execCommand("insertHTML", false, "›");
			return false;
		}
	}
}

/**
 * Opens a new HTML window showing the data provided
 */
function openDebugHTML(html){
	myWindow = window.open("data:text/html," + encodeURIComponent(html),
			"_blank", "width=400,height=300");
	myWindow.focus();
}

/**
 * Opens a AJAX request to ajax.php. You only need to send the message and
 * define the callback function
 * @param callback
 * @returns {ajax request}
 */
function getAjaxRequest(callback){
	try{
		var r = new XMLHttpRequest();
	}catch(e1){
		try{
		r = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e2){
			try{
			r = new ActiveXObject("Microsoft.XMLHTTP");
			}catch(e3){
				r = false;
			}
		}
	}
	
	//already open the request and set its target
	r.open("POST", "ajax.php", true);
	r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	//register the callback
	r.onreadystatechange = callback;
	
	//return the AJAX request
	return r;
}

/**
 * Creates a new texteditor using the provided ID as the base area. This function
 * creates the text editor with our own custom buttonset
 * @param areaID
 * @returns {nicEditor}
 */
function newTextEditor(areaID){
	editor = new nicEditor({buttonList : ['bold','italic','underline','strikeThrough','subscript','superscript']});
	editor.panelInstance(areaID);
	return editor;
}

/**
 * Catches a paste event and converts any clipboard data into plain text before pasting.
 */
document.addEventListener("paste", function (e) {
	console.log(e.target.id);
	var pastedText = undefined;
	if (window.clipboardData && window.clipboardData.getData) { // IE
		pastedText = window.clipboardData.getData('Text');
	} else if (e.clipboardData && e.clipboardData.getData) {
		pastedText = e.clipboardData.getData('text/plain');
	}
	e.preventDefault();
	e.target.value = "";
	//then insert HTML
	document.execCommand("insertHTML", false, pastedText);
	return false;
});

/**
 * Returns the URL variables as an array
 * @returns {___anonymous2036_2037}
 */
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
	});
	return vars;
}

/**
 * Returns to the text-load page
 */
function exitEditor(){
	index = window.location.href.indexOf("?");
	window.location = window.location.href.substring(0, index);
}

/**
 * Returns the range HTML code. Quick function to make this compatible with IE (supposedly)
 */
function getRange(){
	r = null;
	tmp = ce('span');
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
}

/**
 * Clears any remaining highlights
 */
function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}