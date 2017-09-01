(function(_a){
    _a.event = {
		/**
		 * Registers the global 'paste' handler and the listener to intercept the 
		 * '<' and '>' characters
		 */
		registerDocumentListeners: function(){
			/**
			 * Catches a paste event and converts any clipboard data into plain text before pasting.
			 */
			document.addEventListener("paste", function (e) {
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
		}
	}
})(alexander);