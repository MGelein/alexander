let user = {};

window.onload = () => {
    $ = document.querySelector; 
    startup();
}
async function startup(){
    await template.load();
    if(await api.ping()){
        user = await api.whoami();
        page.showHome();
    }else{
        page.showLogin();
    }
}