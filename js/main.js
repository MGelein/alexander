window.onload = () => {
    const obj = {
        'key': 'vallbval'
    }
    post('./user.php', obj).then(response => console.log(response));
};

async function post(url, object){
    let response = await fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(object)
    });
    return await response.text()
}

async function getJSON(url){
    let response = await fetch(url);
    return await response.json();
}

async function get(url){
    let response = await fetch(url);
    return await response.text();
}