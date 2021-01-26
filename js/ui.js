const ui = {};

ui.passwordtype = function(event){
    if(event.key == 'Enter') ui.submitLogin();
}

ui.submitLogin = function(){
    const password = document.querySelector('#passwordField').value;
    const username = document.querySelector('#usernameField').value;
    api.loginUser(username, password).then(response =>{
        if(response == 'OK') page.showHome();
        else{
            loginFeedback = document.querySelector('#loginFeedback');
            loginFeedback.innerHTML = 'Username or password incorrect!';
            document.querySelector('#passwordField').value = '';
            document.querySelector('#usernameField').value = '';
            document.querySelector('#usernameField').focus();
        }
    });
}

ui.submitLogout = function(){
    api.logout().then(() => {
        page.showLogin();
    });
}

ui.updateUser = function(username){
    const newName = document.getElementById(`${username}-name`).value;
    const newLevel = document.getElementById(`${username}-level`).value;
    api.updateUser(username, newName, newLevel);
}

ui.deleteUser = function(username){
    if(confirm('Are you sure you want to remove this user?')){
        api.removeUser(username);
    }
}

ui.addUser = function(){
    
}