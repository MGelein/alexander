(function(_a){
    /**
	 * Utility functions are stored here
	 */
	_a.util = {
		/**
		 * Returns the URL variables as an array
		 */
		getUrlVars :function () {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
			});
			return vars;
		},
		
		/**
		 * Creates an element with the specified name
		 * @param name
		 * @returns
		 */
		ce: function(name){
			return document.createElement(name);
		}
	}
})(alexander);