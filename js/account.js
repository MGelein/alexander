(function(_a){
    
    /**
     * Holds stuff related to the account management
     */
    _a.account = {

        /**
         * Methods for user administration
         */
        user: {
            /**
             * Starts editing one of the user data change fields
             * @param {String} type 
             */
            edit: function(type){
                type = type.toLowerCase();
                var id = ((type == 'name') ? '#sUserChangeName': (type == 'pass') ? '#sUserChangePass': '#sUserChangeEmail');
                var button = $(id);
                //If the button is disabled, don't do anything.
                if(button.hasClass('disabled')) return;

                var inputType;
                if(type == 'pass') inputType = 'password';
                else if(type =='email') inputType = 'email';
                else inputType = 'text';

                //get the holder and remove all its children
                button.wrap('<div id="temp"></div>');
                button.hide();
                var holder = $('#temp');
                holder.append('<div id="editingGroup" class="input-group"><input type=' + inputType + ' placeholder="Type new value here" data-editing="' 
                + type + '" class="form-control"><span class="input-group-btn"><input type="button" class="btn btn-primary" onclick="alexander.account.user.saveEdit(this);" value="OK"></span></div>');
                $('#temp').children().unwrap();
            },

            /**
             * Saves the edit we're trying to make
             * @param {HTMLElement} source the source of the click
             */
            saveEdit: function(source){
                //Get a reference to the necessary parts
                var dataField = $(source).parent().parent().find('input[data-editing]');
                var dataType = dataField.attr('data-editing');
                var buttonId = ((dataType == 'name') ? '#sUserChangeName': (dataType == 'pass') ? '#sUserChangePass': '#sUserChangeEmail');
                var button = $(buttonId);
                var data = dataField.val();
                //If there is no data to submit, do nothing
                if(data == undefined || data.length < 1) return;

                var selectedUserEmail = $('.userItem.selected').attr('email');
                var ajaxMethod;
                if(dataType == 'pass') ajaxMethod = 'userChangePass';
                else if(dataType == 'email') ajaxMethod = 'userChangeEmail';
                else if(dataType == 'name') ajaxMethod = 'userChangeName';
                var ajaxData = {
                    edit: data,
                    email: selectedUserEmail
                }

                alexander.ajax.req(ajaxMethod, ajaxData, function(response){
                    console.log(response);
                });

                //we're sure the data is correct, continue
                var editGroup = $(dataField).parent();
                editGroup.remove();
                button.show();
            },

            /**
             * Renders the overview, applies the filter
             */
            renderOverview: function(){
                //Get the filter value
                var query = $('#userFilter').val().trim();
                //If the query is no length
                if(query.length == 0) $('.userItem').show();

                //Only show userItems that match the filter
                $('.userItem').each(function(i, user){
                    if($(user).text().indexOf(query) != -1){
                        $(user).show();
                    }else{
                        $(user).hide();
                    }
                });
            },
            
            /**
             * Loads the element clicked on into the userEdit
             */
            loadControl: function(userElement){
                //Now check if there if the passed item is selected, else unloading.
                var loading = !$(userElement).hasClass('selected');
                //First deselect all
                $('.userItem').removeClass('selected');
                
                if(loading){
                    $(userElement).addClass('selected');
                    $('#sUserName').html($(userElement).text());
                    $('#sUserChangeName').removeClass('disabled');
                    $('#sUserChangePass').removeClass('disabled');
                    $('#sUserChangeEmail').removeClass('disabled');
                }else{
                    $(userElement).removeClass('selected');
                    $('#sUserName').text("No User Selected");
                    $('#sUserChangeName').addClass('disabled');
                    $('#sUserChangePass').addClass('disabled');
                    $('#sUserChangeEmail').addClass('disabled');
                }
            },

            /**
             * Requests the user overview content
             */
            loadOverview: function(){
                alexander.ajax.req('loadUserOverview', '', function(response){
                    $('#userList').html(response);
                    $('.userItem').click(function(){
                        alexander.account.user.loadControl(this);
                    });
                    alexander.account.user.renderOverview();
                });
            }
        },
        /**
         * This function generates the "set new password" field only when it is needed. The comparing
         * of the old and new password is handled by the server. We can't trust client-side code.
         */
        changePass : function(){
            //find the password area
            var p = $('#pass');
            //first remove all previous children
            p.children().remove();
            //first empty the found element

            var formHTML = "<form class='form-horizontal' action='index.php' method='post'>"
            +"<input id='newPass' type='password' name='password' placeholder='New Password' class='form-control passField'>"
            +"<input type='password' name='passwordCheck' placeholder='New Password (Repeat)' class='form-control passField'>"
            +"<input type='password' name='passwordOld' placeholder='Old Password' class='form-control passField'>"
            +"<input type='submit' class='btn btn-primary' value='Change Password'>"
            +"</form>";

            //append the HTML to the passwird field
            p.append(formHTML);

            //Focus on the new textField
            $('#newPass').focus();
        }
    };
})(alexander);
