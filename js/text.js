(function(_a){
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
    
    /**
     * Global text object used to make changes to texts
     */
    _a.text = {
				
		/**
		 * Loads a complete text into the text-editor
		 */
		load: function(){
			alexander.ajax.req('loadText', alexander.util.getUrlVars()['txtID'], function(responseText){
				nicEditors.findEditor('textEditor').setContent(responseText);
				activateHandles();
				setTimeout(convertNote, 1000);
			});
		},

		/**
		 * Requests the server to save the text using a AJAX request.
		 * If true is passed as parameter, the editor will also exit
		 * and load the text-loader
		 * @param andExit
		 */
		save: function(andExit){
			//sets up the AJAX message
			var saveData = {
				'textContent': nicEditors.findEditor('textEditor').getContent().replace(/&nbsp;/g, ' '),
				'authorName': $('#authorField').val().toLowerCase(),
				'textName': $('#textNameField').val(),
				'textTitle': $('#titleField').val(),
				'locusF': $('#locusFromField').val(),
				'locusT': $('#locusToField').val(),
				'checkIn': andExit,
				'textStatusSelect': $('#textStatusSelect').val()
			}
			//Does the actual Ajax call
			alexander.ajax.req('saveTextContent', saveData, function(responseText){
				switch(responseText){
					case "OK":
						if(checkIn) exitEditor();
						break;
					case "DB_ERR":
						alert("A database error occured. Saving has failed. Try again later.");
						break;

					case 'AUTH_RES_ERR':
						alert("A result error has occured. This authorName is not yet registered. And you don't have the necessary privileges to register a new author");
						break;

					default:
						console.log("ERR:" + responseText);
				}
			});
		},

        /**
	     * Creates a new text and forwards the browser to that page
	     */
        create: function(){
            alexander.ajax.req('newText', '', function(responseText){
                document.location = responseText;
            });
        },
        
        /**
         * Loads the textOverview after the document has loaded.
         * This loads in all possible textItems. 
         */
        loadOverview: function (){
            //Do the actual request
            alexander.ajax.req('loadTextOverview', '', function(responseText){
                $('#textOverview').html(responseText);	
            });
            //Now apply the filter and order elements
            this.renderOverview();
        },

        /**
         * Updates and orders the textOverview. This renders the 
         * filter changes, and orders according the setting of the
         * #textOrder <select>
         */
        renderOverview: function(){
            updateTextOverview();
            orderTextOverview();
        }
    };
})(alexander);