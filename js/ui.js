const ui = {};

ui.passwordtype = function(event){
    if(event.key == 'Enter') ui.submitLogin();
}

ui.submitLogin = function(){
    const password = document.querySelector('#passwordField').value;
    const username = document.querySelector('#usernameField').value;
    api.loginUser(username, password).then(response =>{
        if(response == 'OK') {
            page.showHome();
            location.reload();
        }else{
            loginFeedback = document.querySelector('#loginFeedback');
            loginFeedback.innerHTML = 'Username or password incorrect!';
            document.querySelector('#passwordField').value = '';
            document.querySelector('#usernameField').value = '';
            document.querySelector('#usernameField').focus();
        }
    });
}

ui.openInTextEditor = async function(urn){
    let text = {};
    if(urn) text = await api.getText(urn);
    if(!text.data){
        const newURNInput = document.getElementById('newTextURN');
        if(newURNInput.value.length < 15) {
            ui.blinkError(newURNInput);
            return;
        }
        if(await api.getText(newURNInput.value)){
            ui.blinkError(newURNInput);
            alert("This URN is already taken");
            return;
        }
        text.urn = newURNInput.value;
    }
    page.showTextEditor(text);
}

ui.interceptPaste = function(event){
    let pastedText = '';

    if(event.clipboardData && event.clipboardData.getData){
        pastedText = event.clipboardData.getData('text/plain');
    }
    event.stopPropagation();
    event.preventDefault();

    const text = event.target.innerHTML;
    let cursorPos = 0;
    const selection = window.getSelection();
    if(selection){
        const range = selection.getRangeAt(0);
        if(range){
            cursorPos = range.startOffset;
        }
    }
    const newText = text.slice(0, cursorPos) + pastedText + text.slice(cursorPos);
    event.target.innerHTML = newText;
}

ui.openInAnnotationEditor = async function(urn){
    let text = {};
    if(urn) text = await api.getText(urn);
    page.showAnnotationEditor(text);
}

ui.submitLogout = function(){
    api.logout().then(() => {
        page.showLogin();
        location.reload();
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
    const newUsername = document.getElementById('newUsername');
    const newName = document.getElementById('newName');
    const newLevel = document.getElementById('newLevel');
    const newPassword1 = document.getElementById('newPassword1');
    const newPassword2 = document.getElementById('newPassword2');
    let errorFound = false;
    if(newUsername.value.length < 10){
        ui.blinkError(newUsername);
        errorFound = true;
    }
    if(newName.value.length < 5){
        ui.blinkError(newName);
        errorFound = true;
    }
    if(newPassword1.value != newPassword2.value){
        ui.blinkError(newPassword2);
        errorFound = true;
    }else if(newPassword1.value.length < 8){
        ui.blinkError(newPassword2);
        ui.blinkError(newPassword1);
        errorFound = true;
    }
    if(!errorFound){
        api.addUser(newUsername.value, newName.value, newPassword1.value, newLevel.value).then(()=>{
            page.showUsers();
        });
    }
}

ui.changePassword = function(){
    const newPassword1 = document.getElementById('newPassword1');
    const newPassword2 = document.getElementById('newPassword2');
    let errorFound = false;
    if(newPassword1.value != newPassword2.value){
        ui.blinkError(newPassword2);
        errorFound = true;
    }else if(newPassword1.value.length < 8){
        ui.blinkError(newPassword2);
        ui.blinkError(newPassword1);
        errorFound = true;
    }
    if(!errorFound){
        api.changePassword(newPassword1.value).then(()=>{
            page.showHome();
        });
    }
}

ui.blinkError = function(el){
    el.classList.add('error');
    setTimeout(() => el.classList.remove('error'), 2000);
}