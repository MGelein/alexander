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
