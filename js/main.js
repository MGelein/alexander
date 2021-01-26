window.onload = () => {
    const obj = {
        'action': 'ping',
        'username': 'test@gmail.com',
        'password': 'bla',
        'name': 'Dummy',
        'level': 'student'  
    }
    post('./user.php', obj).then(response => console.log(response));
};

async function post(url, object){
    let response = await fetch(url, {
        method: "POST",
        cache: "no-store",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(object)
    });
    return await response.text()
}

async function getJSON(url){
    let response = await fetch(url, {cache: "no-store"});
    return await response.json();
}

async function get(url){
    let response = await fetch(url, {cache: "no-store"});
    return await response.text();
}