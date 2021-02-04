const api = {};

api.addText = async function(urn, data, level){
    const obj = {
        'action': 'add',
        'urn': urn,
        'data': data,
        'level': level
    };
    return post('./text.php', obj);
}
api.updateText = api.addText;

api.requestNoteURN = function(){
    return post('./note.php', {action: 'request_urn'});
}

api.addNote = async function(urn, parent, data, type){
    print(urn, parent, data, type);
    const obj = {
        'action': 'add',
        'urn': urn,
        'parent': parent,
        'data': data,
        'type': type
    };
    return post('./note.php', obj);
}
api.updateNote = api.addNote;

api.removeText = async function(urn){
    return post('./text.php', {action: 'remove', 'urn': urn});
}

api.removeNote = async function(urn){
    return post('./note.php', {action: 'remove', 'urn': urn});
}

api.listTexts = async function(){
    return post('./text.php', {action: 'list'}, true);
}

api.getNotesByType = async function(type){
    const obj ={
        action: 'list',
        filter: 'type',
        'type': type
    }
    return post('./note.php', obj, true);
}

api.getNotesByParent = async function(parent){
    const obj ={
        action: 'list',
        filter: 'parent',
        'parent': parent
    }
    return post('./note.php', obj, true);
}

api.getText = async function(urn){
    return post('./text.php', {'action': 'get', 'urn': urn}, true);
}

api.getNote = async function(urn){
    return post('./note.php', {'action': 'get', 'urn': urn}, true);
}

api.loginUser = async function(username, password){
    const obj = {
        'action': 'login',
        'username': username,
        'password': password
    }
    return post('./user.php', obj);
}

api.ping = async function(){
    return post('./user.php', {'action': 'ping'}, true);
}

api.whoami = async function(){
    return post('./user.php', {'action': 'whoami'}, true);
}

api.listUsers = async function(){
    return post('./user.php', {'action': 'list'}, true);
}

api.logout = async function(){
    const obj = { 'action' : 'logout' };
    return post('./user.php', obj);
}

api.removeUser = async function(username){
    const obj = {'action': 'remove', 'username': username};
    return post('./user.php', obj);
}

api.updateUser = async function(username, name, level){
    const obj = {
        'action': 'update',
        'username': username,
        'name': name,
        'level': level
    }
    return post('./user.php', obj);
}

api.changePassword = async function(password){
    const obj = {
        'action': 'change_password',
        'password': password
    }
    return post('./user.php', obj);
}

api.addUser = async function(username, name, password, level){
    const obj = {
        'action': 'create',
        'username': username,
        'password': password,
        'name': name,
        'level': level
    }
    return post('./user.php', obj);
}

api.getSessionExpiration = async function(){
    return post('./user.php', {'action': 'expiration'});
}

async function post(url, object, returnJSON){
    if(!returnJSON) returnJSON = false;
    let response = await fetch(url, {
        method: "POST",
        cache: "no-store",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(object)
    });
    const responseText = await response.text();
    if(returnJSON){
        if(responseText.length > 1) return JSON.parse(responseText);
        else return undefined;
    }else{
        return responseText;
    }
}

async function getJSON(url){
    let response = await fetch(url, {cache: "no-store"});
    return await response.json();
}

async function get(url){
    let response = await fetch(url, {cache: "no-store"});
    return await response.text();
}

function print(...args){
    console.log(...args);
}