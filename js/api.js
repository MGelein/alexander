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

async function post(url, object, returnJSON){
    if(!returnJSON) returnJSON = false;
    let response = await fetch(url, {
        method: "POST",
        cache: "no-store",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(object)
    });
    return returnJSON ? await response.json(): await response.text();
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