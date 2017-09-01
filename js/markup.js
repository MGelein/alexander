(function(_a){

    /**
     * The markup object. Creates markup manipulation methods
     */
    _a.markup = {
        /**
         * Adds a markup around the current selection
         */
        insert: function(){
            var range = alexander.select.getRange();
            alexander.select.replaceWithHtml("<span contenteditable='false' id='markupStart' class='handle redHandle'></span>" + range + "<span id='markupEnd' contenteditable='false' class='handle redHandle'></span>");
            alexander.markup.requestID();
        },

        /**
         * Requests a new ID from the server, that will generate a new
         * number and create an empty note from it. Returns the id of the 
         * newly created note and loads it using that
         */
        requestID : function(){
            alexander.ajax.req('requestMarkupID', '', function(responseText){
                var objS = $('#markupStart').get(0);
                var objE = $('#markupEnd').get(0);
                
                objS.id = responseText + '_start';
                objE.id = responseText + '_end';
                
                
                objS.innerHTML = objE.innerHTML = responseText;			
                objS.title = objE.title = responseText;
                
                alexander.markup.registerListeners();                
                alexander.markup.load(responseText);	
            });
        },
        
        /**
         * Removes the handlers from all the handles and re-adds them. May be
         * a little ineffecient but makes it a lot easier to add and remove listeners.
         * It just checks for `.handle` classes and unbinds and rebinds the necessary handlers
         */
        registerListeners: function(){
            //get a reference to all the handles and loop through them
            $('.handle').each(function(index, handle){
                var cHandle = $(handle);
                //rebind mousedown event
                cHandle.unbind('mousedown').mousedown(function(event){
                    alexander.markup.load(this.innerHTML);
                });
    
                //rebind the mouseover event
                cHandle.unbind('mouseover').mouseover(function(event){
                    alexander.markup.highlight(this.title, true, true);
                });
    
                //rebind the mouseover event
                cHandle.unbind('mouseout').mouseout(function(event){
                    alexander.markup.highlight(this.title, false); 
                });
            });

           
        },

        /**
         * Loads the markup with the specified id
         */
        load: function(id){
            console.log(id);
            //check if it is not already loaded:
            var check = $('#holder_' + id).get(0)
            if(check != undefined) return;
            
            //Make an ajax request for the data 
            alexander.ajax.req('loadMarkup', id, function(responseText){
                alexander.editor.column.add(responseText);
                alexander.markup.registerListeners();
                alexander.selection.clear();
                console.log(responseText);
            });
        },

        /**
         * Moves the specified markup to the current selection
         */
        move: function(id){
            //Get a reference to the current tags
            var markupStart = $('#' + id + '_start');
            var markupEnd = $('#' + id + '_end');

            //Get their HTML including the tag themselves
            var startString = markupStart.wrap().parent().html();
            var endString = markupEnd.wrap().parent().html();

            //Remove the actual elements now
            markupStart.unwrap().remove();
            markupEnd.unwrap().remove();
            
            //Finally actually re-add the elements using a contrstructed html string
            alexander.select.replaceWithHtml(startString + alexander.select.getRange() + endString);
            alexander.markup.registerListeners();
        },

        /**
         * Highlights the start and end of this markup. Only fades out
         * if this is not the currently loaded markup
         */
        highlight: function(markupID, doHighlight, showWindow){
            //Input validation
            if(markupID != undefined || markupID == -1) return;
            if(showWindow == undefined) showWindow = false;

            //Get references to both handles
            var start = $("#" + markupID + "_start");
            var end  = $("#" + markupID + "_end");
            var holder = $('#holder_' + markupID);

            //Either highlight or unhighlight based on the boolean value
            if(doHighlight){
                //Highlight the holder
                if(check != undefined && showWindow) check.addClass('highlightMarkup');
                //Highlight the handles
                start.addClass("handleSelected");
                end.addClass("handleSelected");
            }else{
                //Unhighlight the holder
                if(check != undefined) check.removeClass('highlightMarkup');
                //Unhighlight the handles
                start.removeClass("handleSelected");
                end.removeClass("handleSelected");
            }
        },

        /**
         * Closes the editor (if it is open) of the provided markup. This
         * means running its close script using eval. Bit of a hack again,
         * but at the same time allows for tons of customization
         */
        close: function(markupID){
            eval($('#close' + markupID + 'Script').get(0).innerHTML);    
        },

        /**
         * Saves the markup identified by the ID. 
         */
        save: function(markupID){
            //Create the data object to save
            var data = {
                id: markupID,
                content: nicEditors.findEditor('annEditor_' + markupID).getContent()
            }

            //Saves it using AJAX. The id is returned if succesful
            alexander.ajax.req('saveMarkup', data, function(responseText){
                alexander.editor.column.remove(responseText);
            });
        }
    };
})(alexander);