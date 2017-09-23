(function(_a){

    /**
     * The markup object. Creates markup manipulation methods
     */
    _a.markup = {
        /**
         * The currently opened Markup by ID
         */
        currentOpen: -1,

        /**
         * Adds a markup around the current selection
         */
        insert: function(){
            var range = alexander.select.getRange();
            alexander.select.replaceWithHTML("<span contenteditable='false' id='markupStart' class='handle left red'></span>" 
            + range + "<span id='markupEnd' contenteditable='false' class='handle right red'></span>");
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
                
                objS.title = objE.title = responseText;
                
                alexander.markup.registerListeners();                
                alexander.markup.load(responseText);
                alexander.markup.list();	
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
         * Lists all the markups found in the current document and shows it in the #markupRow
         */
        list: function(){
            //Find all found markups
            var markups = $('.handle').filter(function(){
                return $(this).attr('id').indexOf('_start') != -1;
            });
            //First empty the markupRow
            var markupRow = $('#markupRow');
            markupRow.children().remove();

            //Now list all the found markups
            markups.each(function(index, markup){
                var m = $(markup);
                var id = m.attr('id').replace('_start', '');
                var className = m.attr('class').replace('handle', '').replace('selected', '').replace('left', '');
                markupRow.append(
                    "<div class='col-xs-12 markupItem " + className + "' id='" + id + "_holder' markup-id='" + id + "'>" 
                    + "Markup"
                    + "<span class='btn-group btn-group-xs pull-right'>" 
                    + "<button class='btn btn-default' onclick='alexander.markup.move(" + id + ")'><span class='glyphicon glyphicon-resize-horizontal'></span>&nbsp;Move</button>"
                    + "<button class='btn btn-default editButton' onclick='alexander.markup.edit(" + id + ")'><span class='glyphicon glyphicon-pencil'></span>&nbsp;Edit</button>"
                    + "<button class='btn btn-default'><span class='glyphicon glyphicon-search'></span>&nbsp;Focus</button>"
                    + "<button class='btn btn-danger'><span class='glyphicon glyphicon-remove-circle'></span>&nbsp;Remove</button>"
                    + "</span>"
                    + "<div class='markupContent'></div>"
                    + "</div>"
                );
                //Do a request to load this specific markup
                alexander.ajax.req('loadMarkup', id, function(response){
                    $('#' + id + '_holder > .markupContent').html(response);
                });
            });

            //Bind the mouse listener
            $('.markupItem').each(function(index, item){
                var m = $(item);
                m.unbind('mouseout').mouseout(function(event){
                    alexander.markup.highlight($(this).attr('markup-id'), false); 
                });
                m.unbind('mouseover').mouseover(function(event){
                    alexander.markup.highlight($(this).attr('markup-id'), true, true);
                });
            });

            //Hide all textfields
            $('.markupContent').hide();
        },

        /**
         * Starts editing the markup with the specified id (i.e. it shows this markup edit field and hides the others)
         */
        edit: function(id){
            //first hide all others
            $('.markupContent').hide();
            //set all edit buttons to their original content:
            $('.editButton').html("<span class='glyphicon glyphicon-pencil'></span>&nbsp;Edit");
            //If it is already opened it means we want to save
            if(id == alexander.markup.currentOpen){
                alexander.markup.save(id);
                //since it is no longer opened, reset the id
                alexander.markup.currentOpen = -1;
                return;
            }
            //We're opening this id, save it
            alexander.markup.currentOpen = id;
            
            //then hide the one we're editing
            $('#' + id + '_holder > .markupContent').show();
            $('#' + id + '_holder .editButton').html("<span class='glyphicon glyphicon-floppy-disk'></span>&nbsp;Save");
        },

        /**
         * Loads the markup with the specified id
         */
        load: function(id){
            //Make an ajax request for the data 
            alexander.ajax.req('loadMarkup', id, function(responseText){
                alexander.markup.registerListeners();
                alexander.select.clear();
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
            var startString = markupStart.wrap("<span/>").parent().html();
            var endString = markupEnd.wrap("<span/>").parent().html();

            //Remove the actual elements now
            markupStart.unwrap().remove();
            markupEnd.unwrap().remove();
            
            //Finally actually re-add the elements using a contrstructed html string
            alexander.select.replaceWithHTML(startString + alexander.select.getRange() + endString);
            alexander.markup.registerListeners();
        },

        /**
         * Highlights the start and end of this markup. Only fades out
         * if this is not the currently loaded markup
         */
        highlight: function(markupID, doHighlight, showWindow){
            //Input validation
            if(markupID == undefined || markupID == -1) return;
            if(showWindow == undefined) showWindow = false;

            //Get references to both handles
            var start = $("#" + markupID + "_start");
            var end  = $("#" + markupID + "_end");
            var holder = $('#' + markupID + '_holder');

            //Either highlight or unhighlight based on the boolean value
            if(doHighlight){
                //Highlight the handles
                start.addClass("selected");
                end.addClass("selected");
                holder.addClass("selected");
            }else{
                //Unhighlight the handles
                start.removeClass("selected");
                end.removeClass("selected");
                holder.removeClass("selected");
            }
        },

        /**
         * Saves the markup identified by the ID. 
         */
        save: function(id){
            //find out what kind of markup it is and how to save it
            var holder = $('#' + id + '_holder');
            var type = holder.find('.markupData').attr('markup-type');
            var data = {'id': id};
            switch(type){
                case 'default':
                    data.content = holder.find('.markupField').val();
                    break;
            }

            //now that we've constructed the data object, submit it to be saved
            alexander.ajax.req('saveMarkup', data, function(response){
                console.log("response: " + response);
            });
        }
    };
})(alexander);