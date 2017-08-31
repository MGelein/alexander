/**
 * Init. Requests page content when the page is ready
 */
$(document).ready(function(){
	loadTextOverview();
});

/**
 * Creates a new text and forwards the browser to that page
 */
function createText(){
	ajaxReq('newText', '', function(responseText){
		document.location = this.responseText;
	});
}

/**
 * Loads the textOverview after the document has loaded.
 * This loads in all possible textItems. 
 */
function loadTextOverview(){
	//Do the actual request
	ajaxReq('loadTextOverview', '', function(responseText){
		$('#textOverview').html(responseText);	
	});
	//Now apply the filter and order elements
	renderTextOverview();
}

/**
 * Updates and orders the textOverview. This renders the 
 * filter changes, and orders according the setting of the
 * #textOrder <select>
 */
function renderTextOverview(){
	updateTextOverview();
	orderTextOverview();
}

/**
 * Uses JQuery to filter the text after a query has been input
 */
function updateTextOverview(){
	var query = $('#textFilter').val().trim();
	query = query.toLowerCase();
	if(query.length == 0){
		//If there is no query, show all
		$('.textlink').show();
		return;
	}
	//Else check if the query mataches the text-content
	$('.textlink').each(function(i, item){
		if($(item).text().toLowerCase().indexOf(query) != -1){
			$(item).show();
		}else{
			$(item).hide();
		}
	});
}

/**
 * Grabs all the visible elements that have the textLink class
 * and orders them according to the value of the #textOrder select
 */
function orderTextOverview(){
	//Get all the items and their sort order
	var order = $('#textOrder').val().trim().toLowerCase();
	var items = $('.textlink').get();
	var orderClass = (order.startsWith('title') ? '.loaderTitle' : (order.startsWith('name') ? '.loaderName' : '.loaderAuthor'));
	
	//Sorts the items based on the order
	items.sort(function(a, b){
		var textA = $(a).find(orderClass).text();
		var textB = $(b).find(orderClass).text();
		if(textA < textB) return 1;
		if(textB < textA) return -1;
		return 0;
	});

	//Ascending or descending?
	if(order.indexOf('desc') == -1){
		items.reverse();
	}

	//Then re-add all of them
	$.each(items, function(i, item){$('#textOverview').append(item)});
}