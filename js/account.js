(function(_a){
    
    /**
     * Holds stuff related to the account management
     */
    _a.account = {
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
