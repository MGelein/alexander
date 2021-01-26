const ui = {};

ui.passwordtype = function(event){
    if(event.key == 'Enter') ui.submitLogin();
}

ui.submitLogin = function(){
    const password = document.querySelector('#passwordField').value;
    const username = document.querySelector('#usernameField').value;
    api.loginUser(username, password).then(response =>{
        if(response == 'OK') page.show(template.dashboard);
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
        page.show(template.login);
    });
}