(function(_a){
    /**
	 * Contains all methods to do with AJAX
	 */
	_a.ajax = {
		/**
		 * Creates an AJAX request. Transfres the provided data to the server and
		 * answers the callback when a response is successful.
		 * @param {String} method 		A string denoting our intent
		 * @param {Object} ajaxData		A data object containing the data we want to work with 
		 * @param {Function} callback 	A callback function, takes the response string as parameter
		 */
		req: function(method, ajaxData, callbackFn){
			//Simple data object holding the standard data and method 
			var ajaxObject = {
				ajaxMethod: method,
				data: ajaxData
			};
	
			//If we are logging, log the request now
			if(AJAX_LOGGING){
				console.log("AJAX_REQ_START: method=" + method);
				console.log(ajaxData);
				console.log('AJAX_REQ_END')
			}
	
			//Now actually send the ajax request
			$.ajax({
				type: "POST",
				url: "ajax.php",
				data: ajaxObject,
				success: function(result){
					//First log, if we are logging
					if(AJAX_LOGGING){
						console.log("AJAX_RESP_START");
						console.log(result);
						console.log("AJAX_RESP_END");
					}
					//Then call the callback
					callbackFn(result);
				}
			});
		}
	}
})(alexander);