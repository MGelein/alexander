/**Holds if we have typed recently*/
var recentTyped = false;

/**
 * Creates a new text and forwards the browser to that page
 */
function createText(){
	msg="AJAX=" + true + "&newText=" + true;
	
	req = getAjaxRequest(function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(this.responseText != null){
					document.location = this.responseText;			
				}
			}
		}
	});

	req.send(msg);
}

/**
 * Loads the textOverview after the document has loaded.
 */
function loadTextOverview(){
	updateTextOverview();
}

function updateTextOverview(){
	var textOrderElement = $('#textOrder').get(0);
	var textFilterElement = $('#textFilter').get(0);
	msg="AJAX=" + true + "&loadTextOverview=" + textOrderElement.value + "&textFilter=" + textFilter.value;

	req = getAjaxRequest(function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(this.responseText != null){
					var textOverview = $('#textOverview').get(0);
					textOverview.innerHTML = this.responseText;			
				}
			}
		}
	});

	req.send(msg);
}